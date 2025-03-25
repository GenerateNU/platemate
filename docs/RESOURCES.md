## Frontend

- [1] [Custom Hooks](https://react.dev/learn/reusing-logic-with-custom-hooks)
- [2] [Context](https://react.dev/reference/react/createContext)

## Backend

- [1] [Fiber Docs](https://docs.gofiber.io/)

## Mongo

- [1] [Data Modeling](https://www.mongodb.com/developer/products/mongodb/mongodb-schema-design-best-practices/)
- [2] [BSON](https://www.mongodb.com/docs/drivers/go/current/fundamentals/bson/)
- [3] [Schema Validation](https://www.mongodb.com/docs/manual/core/schema-validation/)
- [4] [CRUD Operations](https://www.mongodb.com/docs/manual/crud/)
- [5] [Aggregations](https://www.mongodb.com/docs/manual/aggregation/)

## BSON to JSON Conversion

### 1. **BSON `D`**

**BSON**: An **ordered representation** of a BSON document, typically a slice of key-value pairs.

```bson
bson.D{
  {"name", "Alice"},
  {"age", 30},
  {"hobbies", bson.A{"reading", "traveling", "coding"}}
}
```

**JSON Equivalent**:

```json
[
  { "name": "Alice" },
  { "age": 30 },
  { "hobbies": ["reading", "traveling", "coding"] }
]
```

Explanation:

- `bson.D` is serialized as an **array of objects** in JSON to preserve the order of the fields.

---

### 2. **BSON `M`**

**BSON**: An **unordered representation** of a BSON document, typically implemented as a map.

```bson
bson.M{
  "name": "Alice",
  "age": 30,
  "hobbies": bson.A{"reading", "traveling", "coding"}
}
```

**JSON Equivalent**:

```json
{
  "name": "Alice",
  "age": 30,
  "hobbies": ["reading", "traveling", "coding"]
}
```

Explanation:

- `bson.M` is serialized as a **single JSON object** since JSON objects inherently do not guarantee order.

---

### 3. **BSON `A`**

**BSON**: An **ordered representation** of a BSON array, typically a slice.

```bson
bson.A{
  "Alice",
  30,
  bson.M{"hobby": "reading"},
  bson.D{{"key1", "value1"}, {"key2", "value2"}}
}
```

**JSON Equivalent**:

```json
[
  "Alice",
  30,
  { "hobby": "reading" },
  [{ "key1": "value1" }, { "key2": "value2" }]
]
```

Explanation:

- `bson.A` is serialized as a **JSON array**, maintaining the order of elements.

---

### 4. **BSON `E`**

**BSON**: A single **element** inside a `bson.D` type, typically a key-value pair.

```bson
bson.E{"name", "Alice"}
```

**JSON Equivalent**:

```json
{ "name": "Alice" }
```

Explanation:

- `bson.E` is serialized as a **single JSON object** representing the key-value pair.

---

### Complete BSON Example (Using All Types)

Here’s an example combining all BSON types:

**BSON**:

```bson
bson.D{
  {"name", "Alice"},                          // bson.E
  {"details", bson.M{                         // bson.M
    "age": 30,
    "hobbies": bson.A{"reading", "coding"}    // bson.A
  }},
  {"attributes", bson.D{                      // bson.D
    {"height", 5.4},
    {"weight", 120}
  }}
}
```

**JSON Equivalent**:

```json
[
  { "name": "Alice" },
  {
    "details": {
      "age": 30,
      "hobbies": ["reading", "coding"]
    }
  },
  { "attributes": [{ "height": 5.4 }, { "weight": 120 }] }
]
```

Explanation:

- The `bson.D` outermost layer is represented as a **JSON array of objects** to preserve order.
- The `bson.M` (map) is serialized as a **JSON object**.
- The `bson.A` (array) is serialized as a **JSON array**.
- The inner `bson.D` (ordered document) is serialized as a **JSON array of objects** to preserve its order.
