import * as React from 'react';
import * as style from './style.css';

export class Loader extends React.Component {
    render() {
        return <div className={style.loader}><div></div></div>
    }
}
