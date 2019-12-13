#!/usr/bin/env python3
# @generated AUTOGENERATED file. Do not Change!

from dataclasses import dataclass, field
from datetime import datetime
from enum import Enum
from functools import partial
from typing import Any, Callable, List, Mapping, Optional

from dataclasses_json import dataclass_json
from marshmallow import fields as marshmallow_fields

from .datetime_utils import fromisoformat


DATETIME_FIELD = field(
    metadata={
        "dataclasses_json": {
            "encoder": datetime.isoformat,
            "decoder": fromisoformat,
            "mm_field": marshmallow_fields.DateTime(format="iso"),
        }
    }
)


@dataclass_json
@dataclass
class SearchQuery:
    __QUERY__ = """
    query SearchQuery(
  $name: String!
  $after: Cursor
  $first: Int = 10
  $before: Cursor
  $last: Int
) {
  searchForEntity(
    name: $name
    after: $after
    first: $first
    before: $before
    last: $last
  ) {
    edges {
      node {
        entityId
        entityType
        name
        type
      }
    }
  }
}

    """

    @dataclass_json
    @dataclass
    class SearchQueryData:
        @dataclass_json
        @dataclass
        class SearchEntriesConnection:
            @dataclass_json
            @dataclass
            class SearchEntryEdge:
                @dataclass_json
                @dataclass
                class SearchEntry:
                    entityId: str
                    entityType: str
                    name: str
                    type: str

                node: Optional[SearchEntry] = None

            edges: Optional[List[SearchEntryEdge]] = None

        searchForEntity: SearchEntriesConnection

    data: Optional[SearchQueryData] = None
    errors: Any = None

    @classmethod
    # fmt: off
    def execute(cls, client, name: str, after: Optional[str] = None, first: Optional[int] = 10, before: Optional[str] = None, last: Optional[int] = None):
        # fmt: off
        variables = {"name": name, "after": after, "first": first, "before": before, "last": last}
        response_text = client.call(cls.__QUERY__, variables=variables)
        return cls.from_json(response_text).data