RBush-Ext
=========

RBush-Ext is a fork of @mourner's brilliant [rBush package](https://github.com/mourner/rbush), allows for meaningful
use of the internal tree groupings/nodes.

Please refer to @mourner's [rBush github page](https://github.com/mourner/rbush) for the original documentation. Here
I will only document the new functionality in rbush-ext.

Here's a [jsfiddle demo]: https://jsfiddle.net/sikanrong/4tjs1z8v/

## RBush-Ext Features

### getNode

RBush-Ext assigns an eight-digit alphanumeric ID to each node in the tree. This allows users to more easily make use of the
internal tree structure for grouping. Nodes in the tree are indexed by UUID and can be retreived using getNode.

```js
    var uuid = 'ksJ2Q1O5';
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
    var uuid = 'ksJ2Q1O5';
    var node = tree.getNode(uuid);
    tree.all(node); //returns all leaf-nodes of this 'branch' (subtree) in an array.
```

### search

RBush-Ext modifies the return data from #search. Instead of just returning an array of leaf-nodes that correspond with
the searched area, it now also returns all parentNodes that coincide with the search, organized by height in the tree.

This facilitates working with groupings by the parent rtree nodes (and their UUIDs) for a given height H.

```js
    var results = tree.search({minX: 0, minY: 0, maxX: 100, maxY: 100});
    
    //now the normal results array from classic RBush
    console.log(results.leafNodes);
    
    //parent nodes by height; array index is (parent_node.height - 1)
    console.log(results.parentNodes); 
    
    //Example output
    /*
        [
            0: [
                <Node>,
                <Node>,
                <Node>
            ],

            1: [
                <Node>,
                <Node>
            ],

            2: [
                <Node>
            ]
        ]
    */
```

### setDeterminism
Rbush-Ext adds an option to generate deterministic IDs. This means that 
each node in the tree will have an ID generated based on the IDs of its 
children. All changes to the underlying data will also cause 
deterministic ID changes that bubble up the tree.

```js
var tree = rbush()
    .setDeterminism(true)
    .load(data);
```

### setDeterminismSeedFunc
For the user-entered leaf-node data in the tree, there may not be a
straightforward way to get a unique identifier for each node. By default
rbush-ext uses the required bounding box of each child node, however a
different function can be provided to calculate seed functions for the 
leaf nodes of the tree. Example:

```js
var tree = rbush()
    .setDeterminism(true)
    .setDeterminismSeedFunc(function(_n) {
        //if the leaf nodes have a UUID key, use it to generate the IDs of the tree's nodes
        return _n.id || _n.uuid
    })
    .load(data);
``` 

## Performance

Both benchmarks performed with Node.js v6.2.2 on a Macbook Pro (mid-2012 A1278), with Samsung EVO SSD disk.

(Note: these numbers hugely improved in version 2.0.5)

Test                         | RBush (classic) | RBush-Ext
---------------------------- | ------ | ------
insert 1M items one by one   | 3.71s  | 7.47s
1000 searches of 0.01% area  | 0.03s  | 0.06s
1000 searches of 1% area     | 0.34s  | 0.73s
1000 searches of 10% area    | 2.30s  | 4.14s
remove 1000 items one by one | 0.02s  | 0.22s
bulk-insert 1M items         | 1.58s  | 3.23s

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