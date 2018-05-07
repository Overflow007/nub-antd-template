import React from 'react';
import _ from 'lodash';
import PageNotFound from 'routes/PageNotFound/index';

const asyncComp = loadComponent => { 
    class AsyncComponent extends React.Component {
        state = {
            Component: null,
        }
        componentDidMount() {
            if(this.trueOnResize==null){
                this.trueOnResize = _.throttle(this.onResize,300)
            }
            
            window.addEventListener('resize', this.trueOnResize, false);
            this.trueOnResize();
        }

        componentWillUnmount() {
            window.removeEventListener('resize', this.trueOnResize, false);
        }

        onResize=(e)=>{
            if(this.wrappedInstance&&this.wrappedInstance.onResize){
                this.wrappedInstance.onResize(e);
            }
        }

        componentDidCatch(error, errorInfo) {
            // Catch errors in any components below and re-render with error message
            console.log("捕获到错误", error, errorInfo);
            /* this.setState({
              'error': error,
              'errorInfo': errorInfo
            }); */
            // You can also log error messages to an error reporting service here
          }


        componentWillMount() {
            if (this.hasLoadedComponent()) {
                return;
            }

            loadComponent()
                .then(module =>{
                     
                    if(module.default){
                        return module.default;
                    }else{
                        return module;
                    }
                    
                })
                .then((c) => {
                   
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
        

            const { Component } = this.state;
            return (Component) ? (<Component {...props} ref = {this.setWrappedInstance} />) : null;
        }
    }
    return AsyncComponent;
};

export default asyncComp;