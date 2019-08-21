import React from 'react';

import { connect } from 'react-redux';

import { bindActionCreators } from 'redux';

import { withRouter } from 'react-router-dom';

import { blankInputError, passwordMismatchError } from '../../constants/validationMessages';

import { createUserAccount } from '../../services/users';

import withAuthentication from "../HOCs/withAuthentication";

import FormErrorsAlertBox from '../AlertBoxes/FormErrorsAlertBox';

import SignUpForm from './SignUpForm';



class SignUp extends React.Component {
    state = {
        email: '',
        password: '',
        confirm_password: '',
        errors: null
    };

    componentDidMount() {
        return this.props.authenticated ? this.props.history.push("/") : null
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        const { createUserErrors } = this.props.user;

        if (prevProps.user.createUserErrors !== createUserErrors) {
            this.setState((state) => {
                return {
                    errors: Object.values(createUserErrors)
                }
            })
        }

        return this.props.authenticated ? this.props.history.push("/") : null
    }

    render() {
        return (
            <div className='col-4 offset-4 mt-5'>
                { this.hasErrors() ? (<FormErrorsAlertBox errors={this.state.errors} hasErrors={this.hasErrors} removeErrors={this.removeErrors}/>) : '' }

                <SignUpForm email={this.state.email} password={this.state.password} confirm_password={this.state.confirm_password} handleSubmit={this.handleSubmit} handleEmailChange={this.handleEmailChange} handlePasswordChange={this.handlePasswordChange} handleConfirmPasswordChange={this.handleConfirmPasswordChange}/>
            </div>
        )
    }

    handleSubmit = (event) => {
        event.preventDefault();

        const { email, password, confirm_password } = this.state;

        const errors = {};

        if(email.length <= 0) {
            errors['email'] = blankInputError;
        }

        if(password.length <= 0) {
            errors['password'] = blankInputError
        }

        if(confirm_password.length <= 0) {
            errors['confirm_password'] = blankInputError;
        }

        if(password.length > 0 && confirm_password.length > 0) {
            if(password !== confirm_password) {
                errors['_passwords'] = passwordMismatchError
            }
        }

        if(Object.keys(errors).length > 0) {
            this.setState((state) => {
                return { errors }
            })
        }

        if(!Object.keys(errors).length > 0) {
            const { email }    = this.state;
            const { password } = this.state;
            const newUserData  = { email, password };
            const { cookies }  = this.props;

            this.props.createUserAccount(newUserData, cookies);
        }
    };

    handleEmailChange = (event) => {
        const email = event.target.value;
        this.setState((state) => {
            return {
                email,
            };
        })
    };

    handlePasswordChange = (event) => {
        const password = event.target.value;
        this.setState((state) => {
            return {
                password,
            };
        })
    };

    handleConfirmPasswordChange = (event) => {
        const confirm_password = event.target.value;
        this.setState((state) => {
            return {
                confirm_password,
            };
        })
    };

    hasErrors = () => {
        if (!!this.state.errors) {
            return Object.entries(this.state.errors).length > 0;
        }

        return false
    };

    removeErrors = () => {
        this.setState((state) => {
            return {
                errors: {}
            }
        })
    };
}

const mapStateToProps = ({ user }) => {
    return { user }
};

const mapDispatchToProps = dispatch => {
    return bindActionCreators({ createUserAccount }, dispatch)
};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(withAuthentication(SignUp)));
