RBush-Ext
=========

RBush-Ext is a fork of @mourner's brilliant [rBush package](https://github.com/mourner/rbush), allows for meaningful
use of the internal tree groupings/nodes.

Please refer to @mourner's [rBush github page](https://github.com/mourner/rbush) for the original documentation. Here
I will only document the new functionality in rbush-ext.

## RBush-Ext Features

### getNode

RBush-Ext assigns a unique ID (UUID V4) to each node in the tree. This allows users to more easily make use of the
internal tree structure for grouping. Nodes in the tree are indexed by UUID and can be retreived using getNode.

```js
    var uuid = '550e8400-e29b-41d4-a716-446655440000';
    // will return node that corresponds to this UUID, if one exists.
    var node = tree.getNode(uuid);
```

### walk

This function walks through all nodes in the tree.

```js
    tree.walk(function(node){
        //do stuff with each node.
        console.log(node.id);
    });
```

### all(node)

RBush-Ext adds an optional node parameter to #all, which allows to return all leaf nodes in the subtree.

```js
    var uuid = '550e8400-e29b-41d4-a716-446655440000';
    var node = tree.getNode(uuid);
    tree.all(node); //returns all leaf-nodes of this 'branch' (subtree) in an array.
```

### search

RBush-Ext modifies the return data from #search. Instead of just returning an array of leaf-nodes that correspond with
the searched area, it now also returns all parentNodes that coincide with the search, organized by height in the tree.

This facilitates working with groupings by the parent rtree nodes (and their UUIDs) for a given height H.

```js
    var results = tree.search({minX: 0, minY: 0, maxX: 100, maxY: 100});
    console.log(results.leafNodes); //now the normal results array from classic RBush
    console.log(results.parentNodes); //Returns parent nodes organized by height and then UUID.
    /*
        {
            0: {
                '00000000-0000-0000-A000-000000000001': <Node>,
                '00000000-0000-0000-A000-000000000002': <Node>,
                '00000000-0000-0000-A000-000000000003': <Node>
            },

            1: {
                '00000000-0000-0000-A000-000000000004': <Node>,
                '00000000-0000-0000-A000-000000000005': <Node>
            },

            2: {
                '00000000-0000-0000-A000-000000000006': <Node>
            }
        }
    */
```

## Performance

Performed with Node.js v4.1.0 on a Macbook Pro (mid-2012 A1278).
Original RBush benchmarks performed on Performed with Node.js v6.2.2 on a Retina Macbook Pro 15 (mid-2012 A1398).

Some of the decrease in performance in RBush-Ext is just due to the differences in hardware. "insert 1M items one by
one" performance may have dropped due to UUID V4 generation for each node. However bulk-insert still seems to perform
well.


Test                         | RBush  | RBush-Ext
---------------------------- | ------ | ------
insert 1M items one by one   | 3.18s  | 17.90s
1000 searches of 0.01% area  | 0.03s  | 0.16s
1000 searches of 1% area     | 0.35s  | 1.36s
1000 searches of 10% area    | 2.18s  | 7.30s
remove 1000 items one by one | 0.02s  | 0.24s
bulk-insert 1M items         | 1.25s  | 2.22s

## Tests

RBush-Ext updates the tape-based test suite to work with the new #search return format. Also adds new tests for the new
RBush-Ext functionality.

```
# #search should return parent nodes of all leaf nodes, sorted by height
ok 25 should be equivalent
ok 26 should be equivalent
ok 27 should be equivalent

# #all returns all points in subtree if passed a node
ok 28 should be equivalent

# #getNode returns the correct node when passed the corresponding UUID
ok 31 should be equivalent

# #walk should iterate over all nodes
ok 32 should be equivalent

1..47
# tests 47
# pass  47

# ok
```