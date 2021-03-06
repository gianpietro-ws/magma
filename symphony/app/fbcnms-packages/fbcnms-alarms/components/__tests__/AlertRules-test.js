/**
 * Copyright 2004-present Facebook. All Rights Reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 * @format
 */
import 'jest-dom/extend-expect';
import * as React from 'react';
import AlertRules from '../AlertRules';
import MuiStylesThemeProvider from '@material-ui/styles/ThemeProvider';
import defaultTheme from '@fbcnms/ui/theme/default';
import {MemoryRouter} from 'react-router-dom';
import {MuiThemeProvider} from '@material-ui/core/styles';
import {SnackbarProvider} from 'notistack';
import {act, cleanup, fireEvent, render} from '@testing-library/react';
import {apiMock, mockApiUtil} from '../../test/testHelpers';
import type {GenericRule} from '../RuleInterface';

jest.mock('@fbcnms/ui/hooks/useSnackbar');
jest.mock('@fbcnms/ui/hooks/useRouter');

afterEach(() => {
  cleanup();
  jest.clearAllMocks();
});

const enqueueSnackbarMock = jest.fn();
jest
  .spyOn(require('@fbcnms/ui/hooks/useSnackbar'), 'useEnqueueSnackbar')
  .mockReturnValue(enqueueSnackbarMock);
jest
  .spyOn(require('@fbcnms/ui/hooks/useRouter'), 'default')
  .mockReturnValue({match: {params: {networkId: 'test'}}});

const useLoadRulesMock = jest
  .spyOn(require('../hooks'), 'useLoadRules')
  .mockImplementation(jest.fn(() => ({rules: [], isLoading: false})));

// TextField select is difficult to test so replace it with an Input
jest.mock('@material-ui/core/TextField', () => {
  const Input = require('@material-ui/core/Input').default;
  return ({children: _, InputProps: __, label, ...props}) => (
    <label>
      {label}
      <Input {...props} />
    </label>
  );
});

const axiosMock = jest
  .spyOn(require('axios'), 'default')
  .mockImplementation(jest.fn(() => Promise.resolve({data: {}})));

function Wrapper(props: {route?: string, children: React.Node}) {
  return (
    <MemoryRouter initialEntries={[props.route || '/']} initialIndex={0}>
      <MuiThemeProvider theme={defaultTheme}>
        <MuiStylesThemeProvider theme={defaultTheme}>
          <SnackbarProvider>{props.children}</SnackbarProvider>
        </MuiStylesThemeProvider>
      </MuiThemeProvider>
    </MemoryRouter>
  );
}

const commonProps = {
  apiUtil: mockApiUtil(),
  ruleMap: {},
};

test('renders rules returned by api', () => {
  useLoadRulesMock.mockReturnValueOnce({
    rules: [mockRule()],
    isLoading: false,
  });
  const {getByText} = render(
    <Wrapper>
      <AlertRules {...commonProps} />
    </Wrapper>,
  );
  expect(getByText('<<test>>')).toBeInTheDocument();
  expect(getByText('up == 0')).toBeInTheDocument();
});

test('clicking the add alert icon displays the AddEditAlert view', () => {
  useLoadRulesMock.mockReturnValueOnce({
    rules: [mockRule()],
    isLoading: false,
  });
  const {queryByTestId, getByTestId} = render(
    <Wrapper>
      <AlertRules {...commonProps} />
    </Wrapper>,
  );
  expect(queryByTestId('add-edit-alert')).not.toBeInTheDocument();
  // click the add alert rule fab
  act(() => {
    fireEvent.click(getByTestId('add-edit-alert-button'));
  });
  expect(getByTestId('add-edit-alert')).toBeInTheDocument();
});

test('clicking close button when AddEditAlert is open closes the panel', () => {
  useLoadRulesMock.mockReturnValueOnce({
    rules: [],
    isLoading: false,
  });
  const {queryByTestId, getByTestId, getByText} = render(
    <Wrapper>
      <AlertRules {...commonProps} />
    </Wrapper>,
  );
  expect(queryByTestId('add-edit-alert')).not.toBeInTheDocument();
  // click the add alert rule fab
  act(() => {
    fireEvent.click(getByTestId('add-edit-alert-button'));
  });
  expect(getByTestId('add-edit-alert')).toBeInTheDocument();
  act(() => {
    fireEvent.click(getByText(/close/i));
  });
  expect(queryByTestId('add-edit-alert')).not.toBeInTheDocument();
});

test('clicking the "edit" button in the table menu opens AddEditAlert for that alert', async () => {
  useLoadRulesMock.mockReturnValueOnce({
    rules: [
      mockRule({
        rawRule: {
          alert: 'test',
        },
      }),
    ],
    isLoading: false,
  });
  const {getByText, getByLabelText} = render(
    <Wrapper>
      <AlertRules {...commonProps} />
    </Wrapper>,
  );

  // open the table row menu
  act(() => {
    fireEvent.click(getByLabelText(/action menu/i));
  });
  // click the edit buton
  act(() => {
    fireEvent.click(getByText(/edit/i));
  });
  expect(getByLabelText(/rule name/i).value).toBe('test');
});

/**
 * Test AlertRules' integration with AddEditAlert. It passes in a specific
 * columnStruct object so we need to test that this works properly.
 */
describe('AddEditAlert > Prometheus Editor', () => {
  test('Filling the form and clicking Add will post to the endpoint', async () => {
    useLoadRulesMock.mockReturnValueOnce({
      rules: [mockRule()],
      isLoading: false,
    });
    const {getByText, getByTestId, getByLabelText} = render(
      <Wrapper>
        <AlertRules {...commonProps} />
      </Wrapper>,
    );
    act(() => {
      fireEvent.click(getByTestId('add-edit-alert-button'));
    });
    act(() => {
      fireEvent.change(getByLabelText(/rule name/i), {
        target: {value: '<<ALERTNAME>>'},
      });
    });
    act(() => {
      fireEvent.change(getByLabelText(/severity/i), {
        target: {value: 'minor'},
      });
    });
    act(() => {
      fireEvent.change(getByLabelText(/duration/i), {
        target: {value: '1'},
      });
    });
    act(() => {
      fireEvent.change(getByLabelText(/unit/i), {
        target: {value: 'm'},
      });
    });
    act(() => {
      fireEvent.change(getByLabelText(/expression/i), {
        target: {value: 'vector(1)'},
      });
    });
    // This triggers an async call so must be awaited
    await act(async () => {
      fireEvent.click(getByText(/add/i));
    });
    expect(apiMock.mock.calls.slice(-2)[0][0]).toMatchObject({
      networkId: 'test',
      rule: {
        alert: '<<ALERTNAME>>',
        labels: {
          severity: 'minor',
        },
        for: '1m',
        expr: 'vector(1)',
      },
    });
  });

  test('a snackbar is enqueued if adding a rule fails', async () => {
    const enqueueMock = jest.fn();
    jest
      .spyOn(require('@fbcnms/ui/hooks/useSnackbar'), 'useEnqueueSnackbar')
      .mockReturnValue(enqueueMock);

    axiosMock.mockRejectedValueOnce({
      response: {
        status: 500,
        data: {message: 'an error message'},
      },
    });
    const {getByText, getByTestId} = render(
      <Wrapper>
        <AlertRules {...commonProps} />
      </Wrapper>,
    );
    act(() => {
      fireEvent.click(getByTestId('add-edit-alert-button'));
    });

    await act(async () => {
      fireEvent.click(getByText(/add/i));
    });

    expect(enqueueMock).toHaveBeenCalled();
  });
});

function mockRule(merge?: $Shape<GenericRule<{}>>) {
  return {
    name: '<<test>>',
    severity: 'info',
    description: '<<test description>>',
    expression: 'up == 0',
    period: '1m',
    ruleType: 'prometheus',
    rawRule: {},
    ...(merge || {}),
  };
}
