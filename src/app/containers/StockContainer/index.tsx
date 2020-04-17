import * as React from 'react';
import { observable, action, computed } from 'mobx';
import { observer } from 'mobx-react';
import * as style from './style.css';

import { Select, MenuItem, Button, ListItem, ListItemText } from '@material-ui/core';
import { FixedSizeList } from 'react-window';
import { Loader } from 'app/components/Loader';

import stockStore from 'app/stores/StockStore';


interface IProps {
    StockStore: any,
}

@observer
export default class StockContainer extends React.Component<IProps> {
    constructor(props) {
        super(props);

        this.handleChange = this.handleChange.bind(this);
        this.getSymbols = this.getSymbols.bind(this);
    }

    @observable formState = {
        exchange: 0
    }
    
    @observable selectedSymbol = null;

    componentDidMount() {
        stockStore.fetchExchanges();
    }

    @action
    handleChange(event) {
        const { target } = event;
        this.formState[target.name] = target.value;
    }

    @computed get currentExchange() {
        return stockStore.exchanges[this.formState.exchange];
    }

    @computed get currentSymbols() {
        if (!this.currentExchange) {
            return [];
        }

        return stockStore.symbols[this.currentExchange.code] || [];
    }

    @computed get currentSymbol() {
        if (!this.currentExchange || !this.currentSymbols) {
            return {};
        }

        return this.currentSymbols[this.selectedSymbol] || {};
    }

    @computed get currentSymbolMetrics() {
        const data = stockStore.symbolMetrics[this.currentSymbol.symbol] || {};
        return data.metric || {};
    }

    getSymbols() {
        if (this.currentExchange) {
            stockStore.fetchSymbols(this.currentExchange.code);
        }
    }

    @action
    selectSymbol(index: number) {
        this.selectedSymbol = index;
        stockStore.fetchPriceMetrics(this.currentSymbols[index].symbol);
    }

    SymbolRow = ({ index, style }) => (
        <ListItem button style={style} onClick={() => this.selectSymbol(index)}>
            <ListItemText>
                {this.currentSymbols[index].displaySymbol}
            </ListItemText>
        </ListItem>
    );

    render() {
        return <>
            {stockStore.state === 'pending' && <Loader />}
            {stockStore.state !== 'pending' && (<>
                <Select className={style.exchangeSelect} onChange={this.handleChange} value={this.formState.exchange} name="exchange">
                    {stockStore.exchanges.map((exchange, i) => <MenuItem key={exchange.code} value={i}>{exchange.name}</MenuItem>)}
                </Select>
                <Button className={style.exchangeButton} onClick={this.getSymbols}>Get symbols</Button>
                <div className={style.mainDisplay}>
                    <FixedSizeList className={style.symbolList} height={650} width={200} itemSize={46} itemCount={this.currentSymbols.length} >
                        {this.SymbolRow}
                    </FixedSizeList>
                    <div className={style.symbolData}>
                        <h3>{this.currentSymbol.displaySymbol}</h3>
                        <h4>{this.currentSymbol.description}</h4>
                        {this.currentSymbolMetrics['52WeekHigh'] && <span>52 week high: {this.currentSymbolMetrics['52WeekHigh']} {this.currentExchange.currency}</span>}
                        <br/>
                        {this.currentSymbolMetrics['52WeekLow'] && <span>52 week low: {this.currentSymbolMetrics['52WeekLow']} {this.currentExchange.currency}</span>}
                        <br/>
                        {this.currentSymbolMetrics['10DayAverageTradingVolume'] && <span>10 day average trading volume: {this.currentSymbolMetrics['10DayAverageTradingVolume']}</span>}
                    </div>
                </div>
            </>)}
        </>
    }
}
