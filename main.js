import { group, sleep } from 'k6';
import { getOptions } from './config.js';
import { runAuthenticationScenarios } from './scripts/auth-session.js';
import {
  runRaceDeleteSameSiteArea,
  runRaceSiteAreaSameName,
  runRaceUpdateSameContent,
  runWcmScenarios,
} from './scripts/wcm.js';
import { runDamScenarios } from './scripts/dam.js';
import { runSearchScenarios } from './scripts/search.js';
import { runCacheScenarios } from './scripts/cache.js';
import { runCrossDomainScenarios } from './scripts/cross-domain.js';
import { runEdgeScenarios } from './scripts/edge.js';
import { runTransactionScenarios } from './scripts/transaction.js';

export const options = getOptions();

export function fullSuite() {
  group('auth-session', () => {
    runAuthenticationScenarios();
  });

  group('wcm', () => {
    runWcmScenarios();
  });

  group('dam', () => {
    runDamScenarios();
  });

  group('search', () => {
    runSearchScenarios();
  });

  group('cache', () => {
    runCacheScenarios();
  });

  group('cross-domain', () => {
    runCrossDomainScenarios();
  });

  group('edge', () => {
    runEdgeScenarios();
  });

  group('transaction', () => {
    runTransactionScenarios();
  });

  sleep(1);
}

export function raceSiteAreaSameName() {
  group('race-site-area-same-name', () => {
    runRaceSiteAreaSameName();
  });
  sleep(1);
}

export function raceDeleteSameSiteArea() {
  group('race-delete-same-site-area', () => {
    runRaceDeleteSameSiteArea();
  });
  sleep(1);
}

export function raceUpdateSameContent() {
  group('race-update-same-content', () => {
    runRaceUpdateSameContent();
  });
  sleep(1);
}

export default function () {
  fullSuite();
}
