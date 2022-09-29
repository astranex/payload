import { Router } from 'express';
import { Endpoint } from '../config/types';
declare function mountEndpoints(router: Router, endpoints: Endpoint[]): void;
export default mountEndpoints;
