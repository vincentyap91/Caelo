import React from 'react';
import NavProviderDropdownPanel from './NavProviderDropdownPanel';
import { defaultLiveCasinoNavProviders } from '../constants/liveCasinoNavProviders';

export default function LiveCasinoMenu({ open = true, providers = defaultLiveCasinoNavProviders, onProviderClick }) {
    return <NavProviderDropdownPanel open={open} providers={providers} onProviderClick={onProviderClick} />;
}
