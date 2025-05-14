import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
    return (
        <section className="hero is-fullheight-with-navbar">
            <div className="hero-body">
                <div className="container has-text-centered">
                    <h1 className="text-4xl font-bold">404 - Not Found</h1>
                    <Link to="/" className="button is-primary mt-4">Go Home</Link>
                </div>
            </div>
        </section>
    );
};

export default NotFound;