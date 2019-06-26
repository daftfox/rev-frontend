import * as React from 'react';
import IPin from "../../interface/pin";
import './PinStateAnalog.scss';

class PinStateAnalog extends React.Component<{ pin: IPin }, {}> {
    public render() {
        return (
            <div className={ `pin-state-analog` }>{ this.props.pin.value } / 1024</div>
        );
    }
}

export default PinStateAnalog;