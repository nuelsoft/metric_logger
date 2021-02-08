const express = require("express");
const Store = require("../_store");

/**
 *
 * @param {express.Request} request
 * @param {express.Response} response
 */
const logData = (request, response) => {
  const { value } = request.body;
  const { key } = request.params;

  if (!value || isNaN(value))
    return response.status(400).send({
      error: "value must be a number in your request body",
    });

  const out = Store.push(key, parseInt(value));

  return response.status(201).send({
    ...out,
  });
};

/**
 *
 * @param {express.Request} request
 * @param {express.Response} response
 */
const getSum = (request, response) => {
  const { key } = request.params;

  const out = Store.fetch(key, { computeDataSum: true });

  if (!out)
    return response.status(404).send({
      error: "no logs have been made with this key in the last hour",
    });

  return response.status(201).send({
    sum: out.sum,
  });
};

module.exports = { getSum, logData };
