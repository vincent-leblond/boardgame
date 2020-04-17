// API url
const API_URL = "https://viz.edgemind.net/busanalyseapi";
const API_DEV = "http://localhost:8000";

// Plots configurations
const PLOTDATA = {
    regularite: {
        regularite_globale: [
            {
                y: [],
                x: [],
                type: "bar",
                mode: "line+markers+text",
                marker: {
                    color: "#2f4e96"
                },
                orientation: 'h'
            }
        ],
        regularite_day_type: [
            {
                y: [],
                x: [],
                type: "bar",
                marker: {
                    color: "#2f4e96"
                },
                orientation: 'h'
            }
        ],
        regularite_distribution: [
            {
                x: [],
                type: "histogram",
                histnorm: "probability",
                marker: {
                    color: "#2f4e96"
                },
                orientation: 'v',
                autobinx: false,
                xbins: {
                    end: 16,
                    size: 2,
                    start: -16
                }
            }
        ],
        regularite_hour: [
            {
                y: [],
                x: [],
                type: "bar",
                marker: {
                    color: "#2f4e96"
                },
                orientation: 'v'
            }
        ]
    },
    ponctualite: {
        ponctualite_globale: [
            {
                y: [],
                x: [],
                type: "bar",
                mode: "line+markers+text",
                marker: {
                    color: "#2f4e96"
                },
                orientation: 'h'
            }
        ],
        ponctualite_day_type: [
            {
                y: [],
                x: [],
                type: "bar",
                marker: {
                    color: "#2f4e96"
                },
                orientation: 'h'
            }
        ],
        ponctualite_distribution: [
            {
                x: [],
                type: "histogram",
                histnorm: "probability",
                marker: {
                    color: "#2f4e96"
                },
                orientation: 'v',
                autobinx: false,
                xbins: {
                    end: 16,
                    size: 2,
                    start: -16
                }
            }
        ],
        ponctualite_hour: [
            {
                y: [],
                x: [],
                type: "bar",
                marker: {
                    color: "#2f4e96"
                },
                orientation: 'v'
            }
        ]
    },
    temps: {
        temps_global: [],
        temps_hour: []
    },
    lignes: {
        liste: [],
        indicateur_periode_directionnel: [],
        indicateur_periode_bidirectionnel: []
    },
    nbservices: {
        nbservices_hour : [
            {
                y: [10, 15],
                x: [5, 6],
                type: "bar",
                marker: {
                    color: "#2f4e96"
                },
                name: "Réalisé",
                orientation: 'v'
            },
            {
                y: [12, 17],
                x: [5, 6],
                type: "bar",
                marker: {
                    color: "#25a794"
                },
                name: "Théorique",
                orientation: 'v'
            }
        ]
    }
};

const PLOTLAYOUT = {
    regularite: {
        regularite_globale: {
            title: "Conformité globale",
            yaxis: {
                autorange: true,
                tickangle: 0
            },
            showlegend: false,
            height: 200,
            margin: {
                l: 100,
                r: 20,
                b: 30,
                t: 50,
                pad: 0
            },
            xaxis: {
                range: [0, 1],
                tickformat: '%'
            },
            bargap: 0.05
        },
        regularite_day_type: {
            title: "Conformité par type de jour",
            yaxis: {
                autorange: true,
                tickangle: 0
            },
            showlegend: false,
            height: 350,
            margin: {
                l: 100,
                r: 20,
                b: 30,
                t: 50,
                pad: 0
            },
            xaxis: {
                range: [0, 1],
                tickformat: '%'
            },
            bargap: 0.05
        },
        regularite_distribution: {
            title: "Distribution de l'écart sur l'intervalle en minutes",
            yaxis: {
                autorange: true,
                tickangle: 0,
                tickformat: '%'
            },
            showlegend: false,
            height: 350,
            margin: {
                l: 50,
                r: 20,
                b: 30,
                t: 50,
                pad: 0
            },
            xaxis: {
                range: [-16, 16],
                tickvals: [
                    -16, -14, -12,
                    -10, -8, -6, -4, -2,
                    0, 2, 4, 6, 8, 10,
                    12, 14, 16
                ]
            },
            bargap: 0.05,
            offset: 0.1
        },
        regularite_hour: {
            title: "Conformité par heure de la journée",
            yaxis: {
                tickangle: 0,
                range: [0, 1],
                tickformat: '%'
            },
            showlegend: false,
            height: 350,
            margin: {
                l: 100,
                r: 20,
                b: 30,
                t: 50,
                pad: 0
            },
            xaxis: {
                tickvals: [
                    5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22
                ],
                ticksuffix: "h"
            },
            bargap: 0.05
        }
    },
    ponctualite: {
        ponctualite_globale: {
            title: "Conformité globale",
            yaxis: {
                autorange: true,
                tickangle: 0
            },
            showlegend: false,
            height: 200,
            margin: {
                l: 140,
                r: 20,
                b: 30,
                t: 50,
                pad: 0
            },
            xaxis: {
                range: [0, 1],
                tickformat: '%'
            },
            bargap: 0.05
        },
        ponctualite_day_type: {
            title: "Conformité par type de jour",
            yaxis: {
                autorange: true,
                tickangle: 0
            },
            showlegend: false,
            height: 350,
            margin: {
                l: 100,
                r: 20,
                b: 30,
                t: 50,
                pad: 0
            },
            xaxis: {
                range: [0, 1],
                tickformat: '%'
            },
            bargap: 0.05
        },
        ponctualite_distribution: {
            title: "Distribution du retard en minutes",
            yaxis: {
                autorange: true,
                tickangle: 0,
                tickformat: '%'
            },
            showlegend: false,
            height: 350,
            margin: {
                l: 50,
                r: 20,
                b: 30,
                t: 50,
                pad: 0
            },
            xaxis: {
                range: [-16, 16],
                tickvals: [
                    -16, -14, -12,
                    -10, -8, -6, -4, -2,
                    0, 2, 4, 6, 8, 10,
                    12, 14, 16
                ]
            },
            bargap: 0.05,
            offset: 0.1
        },
        ponctualite_hour: {
            title: "Conformité par heure de la journée",
            yaxis: {
                tickangle: 0,
                range: [0, 1],
                tickformat: '%'
            },
            showlegend: false,
            height: 350,
            margin: {
                l: 100,
                r: 20,
                b: 30,
                t: 50,
                pad: 0
            },
            xaxis: {
                tickvals: [
                    5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22
                ],
                ticksuffix: "h"
            },
            bargap: 0.05
        }
    },
    temps: {
        temps_hour: {
            title: "Temps de parcours en minutes",
            yaxis: {
                tickangle: 0,
                range: [],
                ticksuffix: "mn"
            },
            showlegend: true,
            legend: {
                // xanchor: "center",
                // yanchor: "bottom",
                y: 0.5, // play with it
                x: 1   // play with it
            },
            height: 400,
            margin: {
                l: 50,
                r: 20,
                b: 30,
                t: 30,
                pad: 0
            },
            xaxis: {
                tickvals: [
                    5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22
                ],
                ticksuffix: "h",
                hoverformat: '.0f'
            },
            hoverlabel: {namelength :-1}, // full text
            bargap: 0.05,
            hovermode: 'closest'
        }
    },
    nbservices : {
        nbservices_hour: {
            title: "Nombre moyen de services par heure",
            yaxis: {
                tickangle: 0,
                hoverformat: '.1f'
            },
            showlegend: true,
            height: 500,
            margin: {
                l: 30,
                r: 20,
                b: 30,
                t: 50,
                pad: 0
            },
            xaxis: {
                tickvals: [
                    5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22
                ],
                ticksuffix: "h"
            },
            bargap: 0.05,
            barmode : "group"
        }
    }
};

const TABHEADERS = {
    lignes: {
        liste: [
            {
                text: "Ligne", value: "ExternalCode_Line",
                width: "40%", align: "start", sortable: false
            },
            {
                text: "Type de ligne", value: "TypeLigne",
                width: "30%", align: "start", sortable: false
            },
            {
                text: "Disponibilité des données", value: "Disponibilite",
                width: "30%", align: "start", sortable: false
            }
        ],
        indicateur_periode_directionnel: [
            {
                text: "Ligne", value: "ExternalCode_Line",
                width: "10%", align: "start", sortable: false
            },
            {
                text: "Direction", value: "directionname",
                width: "5%", align: "start", sortable: false
            },
            {
                text: "Sens (terminus ou arrêt le plus proche des données temps réel)", value: "direction",
                width: "25%", align: "start", sortable: false
            },
            {
                text: "Jour", value: "Jour_perc",
                width: "8%", align: "end", sortable: false
            },
            {
                text: "HP", value: "HP_perc",
                width: "8%", align: "end", sortable: false
            },
            {
                text: "HC Matin 5h-7h", value: "HC_matin_perc",
                width: "8%", align: "end", sortable: false
            },
            {
                text: "HP Matin 7h-9h", value: "HP_matin_perc",
                width: "8%", align: "end", sortable: false
            },
            {
                text: "HC Journée 9h-16h", value: "HC_journee_perc",
                width: "8%", align: "end", sortable: false
            },
            {
                text: "HP Soir 16h-19h", value: "HP_soir_perc",
                width: "8%", align: "end", sortable: false
            },
            {
                text: "HC Soir 19h-22h", value: "HC_soir_perc",
                width: "8%", align: "end", sortable: false
            }
        ],
        indicateur_periode_bidirectionnel: [
            {
                text: "Ligne", value: "ExternalCode_Line",
                width: "35%", align: "start", sortable: false
            },
            {
                text: "Jour", value: "Jour_perc",
                width: "9%", align: "end", sortable: false
            },
            {
                text: "HP", value: "HP_perc",
                width: "9%", align: "end", sortable: false
            },
            {
                text: "HC Matin 5h-7h", value: "HC_matin_perc",
                width: "9%", align: "end", sortable: false
            },
            {
                text: "HP Matin 7h-9h", value: "HP_matin_perc",
                width: "9%", align: "end", sortable: false
            },
            {
                text: "HC Journée 9h-16h", value: "HC_journee_perc",
                width: "9%", align: "end", sortable: false
            },
            {
                text: "HP Soir 16h-19h", value: "HP_soir_perc",
                width: "9%", align: "end", sortable: false
            },
            {
                text: "HC Soir 19h-22h", value: "HC_soir_perc",
                width: "9%", align: "end", sortable: false
            }
        ]
    },
    temps: {
        temps_global: [
            {
                text: "Sens", value: "directionname",
                width: "2%", align: "start", sortable: false
            },
            {
                text: "Départ", value: "Depart",
                width: "15%", align: "start", sortable: false
            },
            {
                text: "Arrivée", value: "Arrivee",
                width: "15%", align: "start", sortable: false
            },
            {
                text: "Nombre de services", value: "n_services",
                width: "7%", align: "start", sortable: false
            },
            {
                text: "Moyenne", value: "moy_temps",
                width: "5%", align: "end", sortable: false
            },
            {
                text: "Écart type", value: "sd_temps",
                width: "5%", align: "end", sortable: false
            },
            {
                text: "Médiane", value: "med_temps",
                width: "5%", align: "end", sortable: false
            },
            {
                text: "Min", value: "min_temps",
                width: "5%", align: "end", sortable: false
            },
            {
                text: "Max", value: "max_temps",
                width: "5%", align: "end", sortable: false
            }
        ]
    }

};

export { API_URL, PLOTDATA, PLOTLAYOUT, TABHEADERS, API_DEV };
