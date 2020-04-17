import { call } from './core';

const endpoint = process.env.FINNHUB_ENDPOINT;
const token = process.env.FINNHUB_TOKEN;

const params = {token};

export const getExchanges = async function() {
    const response =  await call(`${endpoint}/stock/exchange`, {params})

    return response.data;
}

export const getSymbols = async function(exchange: string) {
    const response =  await call(`${endpoint}/stock/symbol`, {params: {...params, exchange}})

    return response.data;
}

export const getPriceMetrics = async function(symbol: string) {
    const response =  await call(`${endpoint}/stock/metric`, {params: {...params, symbol, metric: 'price'}})

    return response.data;
}