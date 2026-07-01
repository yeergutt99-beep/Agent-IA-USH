import { useEffect, useState } from 'react';
import { api } from '../services/api';
export function useDashboard(){ const [data,setData]=useState<any>(); useEffect(()=>{api.dashboard().then(setData)},[]); return data; }
