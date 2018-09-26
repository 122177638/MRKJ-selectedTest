import axios from 'axios'
import './http'
import domains from './domains'
/* eslint-disable */
export const homebanner = (p) => axios.post(domains.pro1 + '/sm/newselftest/moreselftestsup1', {p: p})
