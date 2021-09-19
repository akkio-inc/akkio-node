# Akkio
Convenient access to the [Akkio](https://www.akkio.com) API from server-side javascript.

## Installation
```bash
npm install --save akkio
```

## Usage
```js
// get your API key at https://app.akk.io/team-settings
const akkio = require('akkio')('your API key');

(async () => {
  // create a new dataset
  const { dataset_id } = await akkio.datasets.create('my new dataset');

  // populate it with some toy data
  const rows = Array.from(new Array(1000)).map(() => {
    const x = Math.random();

    return {
      x,
      'value larger than 0.5': x > 0.5,
    }
  })

  await akkio.datasets.update(dataset_id, {
    rows
  })

  // train a model
  const model = await akkio.models.create({
    dataset_id,
    predict_fields: ['value larger than 0.5'],
    ignore_fields: [],
    extra_attention: false,
    duration: 1
  })

  // field importance
  for (const field in model.field_importance) {
    console.log('field:', field, 'importance:', model.field_importance[field]);
  }

  // model stats
  for (const field of model.stats) {
    for (const outcome of field) {
      console.log(outcome);
    }
  }

  // use the trained model to make predictions
  const predictions = await akkio.models.predict(model.model_id, [
    { x: 0.25 },
    { x: 0.75 },
  ])

  console.log(predictions);
})();
```
