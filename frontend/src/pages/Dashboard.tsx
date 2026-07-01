import { Card, CardContent, Grid2 as Grid, Typography } from '@mui/material';
import { useDashboard } from '../hooks/useDashboard';
export function Dashboard(){ const d=useDashboard(); const cards=[['Reservas',d?.reservations?.length??0],['Mesas',d?.tables?.length??0],['Clientes',d?.customers?.length??0],['Ocupación diaria',d?.dailyOccupancy??0]]; return <Grid container spacing={2}>{cards.map(c=><Grid size={{xs:12,md:3}} key={c[0]}><Card><CardContent><Typography color="text.secondary">{c[0]}</Typography><Typography variant="h3">{c[1]}</Typography></CardContent></Card></Grid>)}</Grid>; }
