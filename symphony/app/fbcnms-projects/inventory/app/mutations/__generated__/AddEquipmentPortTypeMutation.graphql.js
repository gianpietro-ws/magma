/**
 * @generated
 * Copyright 2004-present Facebook. All Rights Reserved.
 *
 **/

 /**
 * @flow
 * @relayHash ec27097e56291d9b8643b3010382b70c
 */

/* eslint-disable */

'use strict';

/*::
import type { ConcreteRequest } from 'relay-runtime';
type EquipmentPortTypeItem_equipmentPortType$ref = any;
export type PropertyKind = "bool" | "date" | "email" | "enum" | "equipment" | "float" | "gps_location" | "int" | "location" | "range" | "string" | "%future added value";
export type AddEquipmentPortTypeInput = {|
  name: string,
  properties?: ?$ReadOnlyArray<PropertyTypeInput>,
  linkProperties?: ?$ReadOnlyArray<PropertyTypeInput>,
|};
export type PropertyTypeInput = {|
  id?: ?string,
  name: string,
  type: PropertyKind,
  index?: ?number,
  category?: ?string,
  stringValue?: ?string,
  intValue?: ?number,
  booleanValue?: ?boolean,
  floatValue?: ?number,
  latitudeValue?: ?number,
  longitudeValue?: ?number,
  rangeFromValue?: ?number,
  rangeToValue?: ?number,
  isEditable?: ?boolean,
  isInstanceProperty?: ?boolean,
  isMandatory?: ?boolean,
  isDeleted?: ?boolean,
|};
export type AddEquipmentPortTypeMutationVariables = {|
  input: AddEquipmentPortTypeInput
|};
export type AddEquipmentPortTypeMutationResponse = {|
  +addEquipmentPortType: ?{|
    +id: string,
    +name: string,
    +$fragmentRefs: EquipmentPortTypeItem_equipmentPortType$ref,
  |}
|};
export type AddEquipmentPortTypeMutation = {|
  variables: AddEquipmentPortTypeMutationVariables,
  response: AddEquipmentPortTypeMutationResponse,
|};
*/


/*
mutation AddEquipmentPortTypeMutation(
  $input: AddEquipmentPortTypeInput!
) {
  addEquipmentPortType(input: $input) {
    id
    name
    ...EquipmentPortTypeItem_equipmentPortType
  }
}

fragment DynamicPropertyTypesGrid_propertyTypes on PropertyType {
  ...PropertyTypeFormField_propertyType
  id
  index
}

fragment EquipmentPortTypeItem_equipmentPortType on EquipmentPortType {
  id
  name
  numberOfPortDefinitions
  propertyTypes {
    ...DynamicPropertyTypesGrid_propertyTypes
    id
  }
  linkPropertyTypes {
    ...DynamicPropertyTypesGrid_propertyTypes
    id
  }
}

fragment PropertyTypeFormField_propertyType on PropertyType {
  id
  name
  type
  index
  stringValue
  intValue
  booleanValue
  floatValue
  latitudeValue
  longitudeValue
  rangeFromValue
  rangeToValue
  isEditable
  isInstanceProperty
  isMandatory
}
*/

const node/*: ConcreteRequest*/ = (function(){
var v0 = [
  {
    "kind": "LocalArgument",
    "name": "input",
    "type": "AddEquipmentPortTypeInput!",
    "defaultValue": null
  }
],
v1 = [
  {
    "kind": "Variable",
    "name": "input",
    "variableName": "input"
  }
],
v2 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "id",
  "args": null,
  "storageKey": null
},
v3 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "name",
  "args": null,
  "storageKey": null
},
v4 = [
  (v2/*: any*/),
  (v3/*: any*/),
  {
    "kind": "ScalarField",
    "alias": null,
    "name": "type",
    "args": null,
    "storageKey": null
  },
  {
    "kind": "ScalarField",
    "alias": null,
    "name": "index",
    "args": null,
    "storageKey": null
  },
  {
    "kind": "ScalarField",
    "alias": null,
    "name": "stringValue",
    "args": null,
    "storageKey": null
  },
  {
    "kind": "ScalarField",
    "alias": null,
    "name": "intValue",
    "args": null,
    "storageKey": null
  },
  {
    "kind": "ScalarField",
    "alias": null,
    "name": "booleanValue",
    "args": null,
    "storageKey": null
  },
  {
    "kind": "ScalarField",
    "alias": null,
    "name": "floatValue",
    "args": null,
    "storageKey": null
  },
  {
    "kind": "ScalarField",
    "alias": null,
    "name": "latitudeValue",
    "args": null,
    "storageKey": null
  },
  {
    "kind": "ScalarField",
    "alias": null,
    "name": "longitudeValue",
    "args": null,
    "storageKey": null
  },
  {
    "kind": "ScalarField",
    "alias": null,
    "name": "rangeFromValue",
    "args": null,
    "storageKey": null
  },
  {
    "kind": "ScalarField",
    "alias": null,
    "name": "rangeToValue",
    "args": null,
    "storageKey": null
  },
  {
    "kind": "ScalarField",
    "alias": null,
    "name": "isEditable",
    "args": null,
    "storageKey": null
  },
  {
    "kind": "ScalarField",
    "alias": null,
    "name": "isInstanceProperty",
    "args": null,
    "storageKey": null
  },
  {
    "kind": "ScalarField",
    "alias": null,
    "name": "isMandatory",
    "args": null,
    "storageKey": null
  }
];
return {
  "kind": "Request",
  "fragment": {
    "kind": "Fragment",
    "name": "AddEquipmentPortTypeMutation",
    "type": "Mutation",
    "metadata": null,
    "argumentDefinitions": (v0/*: any*/),
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "addEquipmentPortType",
        "storageKey": null,
        "args": (v1/*: any*/),
        "concreteType": "EquipmentPortType",
        "plural": false,
        "selections": [
          (v2/*: any*/),
          (v3/*: any*/),
          {
            "kind": "FragmentSpread",
            "name": "EquipmentPortTypeItem_equipmentPortType",
            "args": null
          }
        ]
      }
    ]
  },
  "operation": {
    "kind": "Operation",
    "name": "AddEquipmentPortTypeMutation",
    "argumentDefinitions": (v0/*: any*/),
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "addEquipmentPortType",
        "storageKey": null,
        "args": (v1/*: any*/),
        "concreteType": "EquipmentPortType",
        "plural": false,
        "selections": [
          (v2/*: any*/),
          (v3/*: any*/),
          {
            "kind": "ScalarField",
            "alias": null,
            "name": "numberOfPortDefinitions",
            "args": null,
            "storageKey": null
          },
          {
            "kind": "LinkedField",
            "alias": null,
            "name": "propertyTypes",
            "storageKey": null,
            "args": null,
            "concreteType": "PropertyType",
            "plural": true,
            "selections": (v4/*: any*/)
          },
          {
            "kind": "LinkedField",
            "alias": null,
            "name": "linkPropertyTypes",
            "storageKey": null,
            "args": null,
            "concreteType": "PropertyType",
            "plural": true,
            "selections": (v4/*: any*/)
          }
        ]
      }
    ]
  },
  "params": {
    "operationKind": "mutation",
    "name": "AddEquipmentPortTypeMutation",
    "id": null,
    "text": "mutation AddEquipmentPortTypeMutation(\n  $input: AddEquipmentPortTypeInput!\n) {\n  addEquipmentPortType(input: $input) {\n    id\n    name\n    ...EquipmentPortTypeItem_equipmentPortType\n  }\n}\n\nfragment DynamicPropertyTypesGrid_propertyTypes on PropertyType {\n  ...PropertyTypeFormField_propertyType\n  id\n  index\n}\n\nfragment EquipmentPortTypeItem_equipmentPortType on EquipmentPortType {\n  id\n  name\n  numberOfPortDefinitions\n  propertyTypes {\n    ...DynamicPropertyTypesGrid_propertyTypes\n    id\n  }\n  linkPropertyTypes {\n    ...DynamicPropertyTypesGrid_propertyTypes\n    id\n  }\n}\n\nfragment PropertyTypeFormField_propertyType on PropertyType {\n  id\n  name\n  type\n  index\n  stringValue\n  intValue\n  booleanValue\n  floatValue\n  latitudeValue\n  longitudeValue\n  rangeFromValue\n  rangeToValue\n  isEditable\n  isInstanceProperty\n  isMandatory\n}\n",
    "metadata": {}
  }
};
})();
// prettier-ignore
(node/*: any*/).hash = '454f79d6f06b34bbd5fe4c8aae3f4743';
module.exports = node;
