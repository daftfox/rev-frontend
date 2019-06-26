import * as React from 'react';
import './Toggle.scss';

class Toggle extends React.Component<IToggleProps, {}> {

    public render() {
        return (
            <div className={ this.props.className }>
                <input id={`toggle-${ this.props.id }`}
                       className={ "toggle" }
                       onChange={ ( event ) => this.props.onChange( event.target.checked ) }
                       checked={ this.props.checked }
                       type={ "checkbox" }/>
                <div className={ "wrap" }>
                    <label htmlFor={ `toggle-${ this.props.id }` }>
                        <span className={ "rib" }/>
                        <span className={ "rib" }/>
                        <span className={ "rib" }/>
                    </label>
                </div>
            </div>
        );
    }
}

interface IToggleProps {
    id: string;
    checked: boolean;
    onChange( checked: boolean ): void;
    className?: string;
}

export default Toggle;