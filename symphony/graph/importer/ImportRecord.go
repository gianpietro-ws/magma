// Copyright (c) 2004-present Facebook All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

package importer

import (
	"context"

	"github.com/facebookincubator/symphony/graph/ent"
	"github.com/facebookincubator/symphony/graph/ent/propertytype"
	"github.com/facebookincubator/symphony/graph/graphql/models"

	"github.com/pkg/errors"
	"go.uber.org/zap"
)

type ImportRecord struct {
	line  []string
	title ImportHeader
}

func NewImportRecord(line []string, title ImportHeader) ImportRecord {
	return ImportRecord{
		line:  line,
		title: title,
	}
}

func (l ImportRecord) ZapField() zap.Field {
	return zap.Strings("line", l.line)
}

func (l ImportRecord) Len() int {
	return len(l.line)
}

func (l ImportRecord) Header() ImportHeader {
	return l.title
}

func (l ImportRecord) GetPropertyInput(ctx context.Context, typ interface{}, proptypeName string) (*models.PropertyInput, error) {
	var pTyp *ent.PropertyType
	var err error
	switch l.entity() {
	case ImportEntityEquipment:
		typ := typ.(*ent.EquipmentType)
		pTyp, err = typ.QueryPropertyTypes().Where(propertytype.Name(proptypeName)).Only(ctx)
	case ImportEntityPort:
		typ := typ.(*ent.EquipmentPortType)
		pTyp, err = typ.QueryPropertyTypes().Where(propertytype.Name(proptypeName)).Only(ctx)
	case ImportEntityService:
		typ := typ.(*ent.ServiceType)
		pTyp, err = typ.QueryPropertyTypes().Where(propertytype.Name(proptypeName)).Only(ctx)
	default:
		return nil, errors.Wrapf(err, "entity is not supported %s", l.entity())
	}
	if err != nil {
		return nil, errors.Wrapf(err, "property type does not exist %q", proptypeName)
	}

	idx := l.title.Find(proptypeName)
	if idx == -1 {
		return nil, nil
	}
	return getPropInput(*pTyp, l.line[idx])
}

func (l ImportRecord) entity() ImportEntity {
	return l.Header().entity
}

func (l ImportRecord) ID() string {
	return l.line[0]
}

func (l ImportRecord) Name() string {
	return l.line[1]
}

func (l ImportRecord) TypeName() string {
	return l.line[2]
}

func (l ImportRecord) PortEquipmentName() string {
	if l.entity() == ImportEntityPort {
		return l.line[3]
	}
	return ""
}

func (l ImportRecord) PortEquipmentTypeName() string {
	if l.entity() == ImportEntityPort {
		return l.line[4]
	}
	return ""
}

func (l ImportRecord) ThirdParent() string {
	return l.line[l.title.ThirdParentIdx()]
}

func (l ImportRecord) ThirdPosition() string {
	return l.line[l.title.ThirdPositionIdx()]
}

func (l ImportRecord) SecondParent() string {
	return l.line[l.title.SecondParentIdx()]
}

func (l ImportRecord) SecondPosition() string {
	return l.line[l.title.SecondPositionIdx()]
}

func (l ImportRecord) DirectParent() string {
	return l.line[l.title.DirectParentIdx()]
}

func (l ImportRecord) Position() string {
	return l.line[l.title.PositionIdx()]
}

func (l ImportRecord) LocationsRangeArr() []string {
	s, e := l.title.LocationsRangeIdx()
	return l.line[s:e]
}

func (l ImportRecord) PropertiesSlice() []string {
	return l.line[l.title.PropertyStartIdx():]
}
