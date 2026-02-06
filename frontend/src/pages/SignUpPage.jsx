import { useState } from 'react'
import {useForm} from "react-hook-form"
import { useAuthStore } from '../store/useAuthStore';
import toast from 'react-hot-toast';

const SignUpPage = () => {
    const {isSigninUp, signup} = useAuthStore();

    const {register, reset, handleSubmit} = useForm()

    const on_Submit = async (data) => {
        
        try {
            const isRegistered = await signup(data)

            if (isRegistered) {
                toast.success("User registered")
            }
        } catch (err) {
            toast.error("Registration failed")
        }
    };

    const styles = {
        container: { 
            maxWidth: '400px', 
            margin: '100px auto', 
            padding: '30px', 
            border: '1px solid #dbdbdb', 
            borderRadius: '12px', 
            textAlign: 'center', 
            fontFamily: 'sans-serif' 
        },
        title: { 
            fontSize: '24px', 
            fontWeight: 'bold', 
            marginBottom: '20px', 
            color: '#262626' 
        },
        input: { 
            width: '100%', 
            padding: '12px', 
            marginBottom: '15px', 
            borderRadius: '8px', 
            border: '1px solid #efefef', 
            backgroundColor: '#fafafa', 
            boxSizing: 'border-box' 
        },
        button: { 
            width: '100%', 
            padding: '12px', 
            backgroundColor: '#0095f6', 
            color: '#fff', 
            border: 'none', 
            borderRadius: '8px', 
            fontWeight: '600', 
            cursor: 'pointer', 
            opacity: isSigninUp ? 0.7 : 1 
        },
        link: { 
            marginTop: '15px', 
            fontSize: '14px', 
            color: '#8e8e8e' 
        }
    };

    return (
        <div style={styles.container}>
            <h2 style={styles.title}>Create Account</h2>

            <form onSubmit={handleSubmit(on_Submit)}>
                <input style={styles.input} {...register("name")} type="text" placeholder="Full Name" required  />
                <input style={styles.input} type="email" {...register("email")} placeholder="Email" required  />
                <input style={styles.input} type="password" placeholder="Password" {...register("password")} required />

                <button style={styles.button} type='submit' disabled={isSigninUp}> 
                    {isSigninUp ? 'Creating...' : 'Sign Up'}
                </button>
            </form>

            <div style={styles.link}>
                Have an account? <span  style={{color: '#0095f6', cursor: 'pointer'}}>Log in</span>
            </div>
        </div>
    );
}

export default SignUpPage
