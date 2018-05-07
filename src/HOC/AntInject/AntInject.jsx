import React from 'react';

const antInjectComp = loadComponent => { 
    class AsyncComponent extends React.Component {
        state = {
            Component: null,
        }

        componentWillMount() {
            if (this.hasLoadedComponent()) {
                return;
            }

            loadComponent()
                .then(module =>{console.log(module); return module.default;} )
                .then((c) => {
                    console.log(c);
                    this.setState({ 'Component': c });
                })
                .catch((err) => {
                    console.error('Cannot load component in <AsyncComponent />', err);
                    this.setState({ 'Component': PageNotFound });
                    
                    //throw err;
                });
        }

        getWrappedInstance = () => {
            if (this.props.widthRef) {
              return this.wrappedInstance;
            }
        }
      
        setWrappedInstance = (ref) => {
            this.wrappedInstance = ref;
        }

        hasLoadedComponent() {
            return this.state.Component !== null;
        }

        render() {
            const props = {
                ...this.props
            };
        
            if (this.props.withRef) {
                props.ref = this.setWrappedInstance;
            }

            const { Component } = this.state;
            console.log('rending async component');
            return (Component) ? <Component {...props} /> : null;
        }
    }
    return AsyncComponent;
};

export default antInjectComp;