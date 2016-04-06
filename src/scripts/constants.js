
const slotMapping = {
  0: 'QB',
  1: 'RB',
  2: 'RB',
  3: 'WR',
  4: 'WR',
  5: 'TE',
  6: 'FLEX',
  7: 'D/ST',
  8: 'K',
  9: 'Bench',
  10: 'Bench',
  11: 'Bench',
  12: 'Bench',
  13: 'Bench',
  14: 'Bench',
  15: 'Bench'
};

const teamAliasMapping = {
  ARI: {
    alias: 'Arizona Cardinals',
    id: '022'
  },
  ATL: {
    alias: 'Atlanta Falcons',
    id: '001'
  },
  BAL: {
    alias: 'Baltimore Ravens',
    id: '033'
  },
  BUF: {
    alias: 'Buffalo Bills',
    id: '002'
  },
  CAR: {
    alias: 'Carolina Panthers',
    id: '029'
  },
  CHI: {
    alias: 'Chicago Bears',
    id: '003'
  },
  CIN: {
    alias: 'Cincinnati Bengals',
    id: '004'
  },
  CLE: {
    alias: 'Cleveland Browns',
    id: '005'
  },
  DAL: {
    alias: 'Dallas Cowboys',
    id: '006'
  },
  DEN: {
    alias: 'Denver Broncos',
    id: '007'
  },
  DET: {
    alias: 'Detroit Lions',
    id: '008'
  },
  GB: {
    alias: 'Green Bay Packers',
    id: '009'
  },
  HOU: {
    alias: 'Houston Texans',
    id: '034'
  },
  IND: {
    alias: 'Indianapolis Colts',
    id: '011'
  },
  JAC: {
    alias: 'Jacksonville Jaguars',
    id: '030'
  },
  KC: {
    alias: 'Kansas City Chiefs',
    id: '012'
  },
  MIA: {
    alias: 'Miami Dolphins',
    id: '015'
  },
  MIN: {
    alias: 'Minnesota Vikings',
    id: '016'
  },
  NYG: {
    alias: 'NY Giants',
    id: '019'
  },
  NYJ: {
    alias: 'NY Jets',
    id: '020'
  },
  NE: {
    alias: 'New England Patriots',
    id: '017'
  },
  NO: {
    alias: 'New Orleans Saints',
    id: '018'
  },
  OAK: {
    alias: 'Oakland Raiders',
    id: '013'
  },
  PHI: {
    alias: 'Philadelphia Eagles',
    id: '021'
  },
  PIT: {
    alias: 'Pittsburgh Steelers',
    id: '023'
  },
  SD: {
    alias: 'San Diego Chargers',
    id: '024'
  },
  SF: {
    alias: 'San Francisco 49ers',
    id: '025'
  },
  SEA: {
    alias: 'Seattle Seahawks',
    id: '026'
  },
  STL: {
    alias: 'St. Louis Rams',
    id: '014'
  },
  TB: {
    alias: 'Tampa Bay Buccaneers',
    id: '027'
  },
  TEN: {
    alias: 'Tennessee Titans',
    id: '010'
  },
  WAS: {
    alias: 'Washington Redskins',
    id: '028'
  }
}

const proTeamIdMap = {
  1: 'ATl',
  2: 'BUF',
  3: 'CHI',
  4: 'CIN',
  5: 'CLE',
  6: 'DAL',
  7: 'DEN',
  8: 'DET',
  9: 'GB',
  10: 'TEN',
  11: 'IND',
  12: 'KC',
  13: 'OAK',
  14: 'STL',
  15: 'MIA',
  16: 'MIN',
  17: 'NE',
  18: 'NO',
  19: 'NYG',
  20: 'NYJ',
  21: 'PHI',
  22: 'ARI',
  23: 'PIT',
  24: 'SD',
  25: 'SF',
  26: 'SEA',
  27: 'TB',
  28: 'WAS',
  29: 'CAR',
  30: 'JAX',
  33: 'BAL',
  34: 'HOU'
};

const herokuAppURL = 'https://fantasy-football-server.herokuapp.com/';

const stats = {
  points: {
    label: 'Points',
    fields: ['points']
  },
  pass_completions: {
    label: 'Passing Completions',
    fields: ['passing_completions']
  },
  pass_touchdowns: {
    label: 'Passing Touchdowns',
    fields: ['passing_touchdowns']
  },
  interceptions: {
    label: 'Interceptions',
    fields: ['passing_interceptions']
  },
  rush_yards: {
    label: 'Rushing Yards',
    fields: ['rushing_yards']
  },
  rush_touchdowns: {
    label: 'Rushing Touchdowns',
    fields: ['rushing_touchdowns']
  },
  receptions: {
    label: 'Receptions',
    fields: [
      'receptions'
    ]
  },
  reception_touchdowns: {
    label: 'Receiving Touchdowns',
    fields: [
      'receiving_tds'
    ]
  },
  reception_yards: {
    label: 'Receiving Yards',
    fields: [
      'receiving_yards'
    ]
  },
  total_touchdowns: {
    label: 'Touchdowns',
    fields: [
      'receiving_tds',
      'rushing_touchdowns'
    ]
  },
  total_yards: {
    label: 'Total Yards',
    fields: [
      'rushing_yards',
      'receiving_yards'
    ]
  }
};

const statsPerPosition = {
  'QB': [
    stats.points,
    stats.pass_completions,
    stats.pass_touchdowns,
    stats.interceptions
  ],
  'RB': [
    stats.points,
    stats.rush_yards,
    stats.rush_touchdowns,
    stats.receptions,
    stats.reception_touchdowns
  ],
  'WR': [
    stats.points,
    stats.receptions,
    stats.reception_touchdowns,
    stats.reception_yards
  ],
  'TE': [
    stats.points,
    stats.receptions,
    stats.reception_touchdowns,
    stats.reception_yards
  ],
  'K': []
};