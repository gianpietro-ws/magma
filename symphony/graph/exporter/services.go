// Copyright (c) 2004-present Facebook All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

package exporter

import (
	"context"
	"encoding/json"
	"net/url"
	"strings"

	"github.com/facebookincubator/symphony/cloud/ctxgroup"
	"github.com/facebookincubator/symphony/cloud/log"
	"github.com/facebookincubator/symphony/graph/ent"
	"github.com/facebookincubator/symphony/graph/graphql/models"
	"github.com/facebookincubator/symphony/graph/resolverutil"
	"github.com/pkg/errors"
	"go.uber.org/zap"
)

type servicesFilterInput struct {
	Name          models.ServiceFilterType `json:"name"`
	Operator      models.FilterOperator    `jsons:"operator"`
	StringValue   string                   `json:"stringValue"`
	IDSet         []string                 `json:"idSet"`
	PropertyValue models.PropertyTypeInput `json:"propertyValue"`
}

type servicesRower struct {
	log log.Logger
}

func (er servicesRower) rows(ctx context.Context, url *url.URL) ([][]string, error) {
	log := er.log.For(ctx)

	var (
		err         error
		filterInput []*models.ServiceFilterInput
		dataHeader  = [...]string{bom + "Service ID", "Service Name", "Service Type", "Service External ID", "Customer Name", "Customer External ID"}
	)
	filtersParam := url.Query().Get("filters")
	if filtersParam != "" {
		filterInput, err = paramToServiceFilterInput(filtersParam)
		if err != nil {
			log.Error("cannot filter services", zap.Error(err))
			return nil, errors.Wrap(err, "cannot filter services")
		}
	}
	client := ent.FromContext(ctx)

	services, err := resolverutil.ServiceSearch(ctx, client, filterInput, nil)
	if err != nil {
		log.Error("cannot query services", zap.Error(err))
		return nil, errors.Wrap(err, "cannot query services")
	}
	cg := ctxgroup.WithContext(ctx, ctxgroup.MaxConcurrency(32))

	servicesList := services.Services
	allRows := make([][]string, len(servicesList)+1)

	var propertyTypes []string
	cg.Go(func(ctx context.Context) error {
		serviceIDs := make([]string, len(servicesList))
		for i, l := range servicesList {
			serviceIDs[i] = l.ID
		}
		propertyTypes, err = propertyTypesSlice(ctx, serviceIDs, client, models.PropertyEntityService)
		if err != nil {
			log.Error("cannot query property types", zap.Error(err))
			return errors.Wrap(err, "cannot query property types")
		}
		return nil
	})
	if err := cg.Wait(); err != nil {
		return nil, err
	}

	title := append(dataHeader[:], propertyTypes...)

	allRows[0] = title
	cg = ctxgroup.WithContext(ctx, ctxgroup.MaxConcurrency(32))
	for i, value := range servicesList {
		value, i := value, i
		cg.Go(func(ctx context.Context) error {
			row, err := serviceToSlice(ctx, value, propertyTypes)
			if err != nil {
				return err
			}
			allRows[i+1] = row
			return nil
		})
	}
	if err := cg.Wait(); err != nil {
		log.Error("error in wait", zap.Error(err))
		return nil, errors.WithMessage(err, "error in wait")
	}
	return allRows, nil
}

func serviceToSlice(ctx context.Context, service *ent.Service, propertyTypes []string) ([]string, error) {
	st, err := service.QueryType().Only(ctx)
	if err != nil {
		return nil, err
	}
	serviceType := st.Name

	var customerName, customerExternalID, externalID string
	customer, err := service.QueryCustomer().Only(ctx)
	if err == nil {
		customerName = customer.Name
		if customer.ExternalID != nil {
			customerExternalID = *customer.ExternalID
		}
	}

	if service.ExternalID != nil {
		externalID = *service.ExternalID
	}

	properties, err := propertiesSlice(ctx, service, propertyTypes, models.PropertyEntityService)
	if err != nil {
		return nil, err
	}

	row := []string{service.ID, service.Name, serviceType, externalID, customerName, customerExternalID}
	row = append(row, properties...)
	return row, nil
}

func paramToServiceFilterInput(params string) ([]*models.ServiceFilterInput, error) {
	var ret []*models.ServiceFilterInput
	var inputs []servicesFilterInput
	err := json.Unmarshal([]byte(params), &inputs)
	if err != nil {
		return nil, err
	}

	for _, f := range inputs {
		upperName := strings.ToUpper(f.Name.String())
		upperOp := strings.ToUpper(f.Operator.String())
		StringVal := f.StringValue
		propVal := f.PropertyValue
		maxDepth := 5
		inp := models.ServiceFilterInput{
			FilterType:    models.ServiceFilterType(upperName),
			Operator:      models.FilterOperator(upperOp),
			StringValue:   &StringVal,
			PropertyValue: &propVal,
			IDSet:         f.IDSet,
			MaxDepth:      &maxDepth,
		}
		ret = append(ret, &inp)
	}
	return ret, nil
}
