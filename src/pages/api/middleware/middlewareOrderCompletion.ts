import nextConnect from 'next-connect';
import multipartFormParser from './order-completion';

const middleware = nextConnect();

middleware.use(multipartFormParser);

export default middleware;
