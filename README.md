# akkio-node

## Usage
```js
const akkio = require('akkio')('<-your API key->');
(async () => {
  // create a new dataset
  let newDataset = await akkio.createDataset('my new dataset');

  // populate it with some toy data
  let rows = [];
  for (var i = 0; i < 1000; i++) {
    let x = Math.random();
    rows.push({
      'x': x,
      'value larger than 0.5': x > 0.5,
    });
  }
  await akkio.addRowsToDataset(newDataset.dataset_id, rows);

  // train a model
  let model = await akkio.createModel(newDataset.dataset_id, ['value larger than 0.5'], [], {
    duration: 1
  });

  // field importance
  for (let field in model.field_importance) {
    console.log('field:', field, 'importance:', model.field_importance[field]);
  }

  // model stats
  for (let field of model.stats) {
    for (let outcome of field) {
      console.log(outcome);
    }
  }

  // use the trained model to make predictions
  let predictions = await akkio.makePrediction(model.model_id, [{
    'x': 0.25
  }, {
    'x': 0.75
  }]);
  console.log(predictions);

})();
```
