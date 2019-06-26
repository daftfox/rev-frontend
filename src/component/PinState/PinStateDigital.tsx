import * as React from 'react';
import IPin from "../../interface/pin";
import './PinStateDigital.scss';

class PinStateDigital extends React.Component<{ pin: IPin }, {}> {
    render() {
        return (
            <div className={ `pin-state-digital ${ this.props.pin.value ? 'active' : 'inactive' }` } />
        );
    }
}

export default PinStateDigital;