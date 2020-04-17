import { configure, observable, flow } from 'mobx';
import { getExchanges, getSymbols, getPriceMetrics } from 'app/helpers/api/finnhub';

configure({ enforceActions: "observed" })

class StockStore {
    @observable symbols = {};
    @observable exchanges = [];
    @observable state:string = 'pending';
    @observable symbolMetrics = {};

    fetchExchanges = flow(function* fetchExchanges() {
        const exchanges = yield getExchanges();
        this.exchanges = exchanges;
        this.state = 'ready';
    })

    fetchSymbols = flow(function* fetchSymbols(exchange: string) {
        this.state = 'loading';
        const symbols = yield getSymbols(exchange);
        this.symbols[exchange] = symbols;
        this.state = 'ready';
    })

    fetchPriceMetrics = flow(function* fetchPriceMetrics(symbol: string) {
        this.state = 'loading';
        const metrics = yield getPriceMetrics(symbol);
        this.symbolMetrics[symbol] = metrics;
        this.state = 'ready';
    })

}

export default new StockStore