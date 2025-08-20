// dataTrivia.js
export const usuariosData = [
    {
        ani: "123456789",
        email: "user@user.com",
        puntos: 50,
        total: 50,
        restantes: 3,
        currentQuestion: 1
    },
    {
        ani: "11112222",
        email: "lg@gmail.com",
        puntos: 100,
        total: 150,
        restantes: 130,
        currentQuestion: 3
    },
    {
        ani: "22221111",
        email: "sinRsp@.com",
        puntos: 500,
        total: 100,
        restantes: 0,
        currentQuestion: 10
    }
];

export const preguntasData = [
    {
        id_pregunta: 1,
        id_trivia: 501,
        pregunta: "¿Quién es el coach de Lali?",
        respuestas: [
            {clave: "A", texto: "Lali Espósito", es_correcta: true},
            {clave: "B", texto: "Tini Stoessel", es_correcta: false}
        ]
    },
    {
        id_pregunta: 2,
        id_trivia: 501,
        pregunta: "¿Qué canal transmite La Voz?",
        respuestas: [
            {clave: "B", texto: "Telefe", es_correcta: true},
            {clave: "A", texto: "El Trece", es_correcta: false}
        ]
    },
    {
        id_pregunta: 3,
        id_trivia: 501,
        pregunta: "¿Qué rol cumple Marley?",
        respuestas: [
            {clave: "A", texto: "Conductor", es_correcta: true},
            {clave: "B", texto: "Jurado", es_correcta: false}
        ]
    },
    {
        id_pregunta: 4,
        id_trivia: 501,
        pregunta: "¿Qué hace un coach?",
        respuestas: [
            {clave: "B", texto: "Entrena voces", es_correcta: true},
            {clave: "A", texto: "Elige vestuario", es_correcta: false}
        ]
    },
    {
        id_pregunta: 5,
        id_trivia: 501,
        pregunta: "¿Cuántos equipos hay?",
        respuestas: [
            {clave: "A", texto: "Cuatro", es_correcta: true},
            {clave: "B", texto: "Cinco", es_correcta: false}
        ]
    },
    {
        id_pregunta: 6,
        id_trivia: 501,
        pregunta: "¿Quién es Miranda!?",
        respuestas: [
            {clave: "B", texto: "Dúo de pop", es_correcta: true},
            {clave: "A", texto: "Grupo de rock", es_correcta: false}
        ]
    },
    {
        id_pregunta: 7,
        id_trivia: 501,
        pregunta: "¿Qué hace un botón rojo?",
        respuestas: [
            {clave: "A", texto: "Gira silla", es_correcta: true},
            {clave: "B", texto: "Elimina jugador", es_correcta: false}
        ]
    },
    {
        id_pregunta: 8,
        id_trivia: 501,
        pregunta: "¿Qué sigue tras audiciones?",
        respuestas: [
            {clave: "B", texto: "Batallas", es_correcta: true},
            {clave: "A", texto: "Final", es_correcta: false}
        ]
    },
    {
        id_pregunta: 9,
        id_trivia: 501,
        pregunta: "¿Quién ganó en 2022?",
        respuestas: [
            {clave: "A", texto: "Yhosva", es_correcta: true},
            {clave: "B", texto: "Marcos", es_correcta: false}
        ]
    },
    {
        id_pregunta: 10,
        id_trivia: 501,
        pregunta: "¿Qué edad mínima se requiere?",
        respuestas: [
            {clave: "B", texto: "18 años", es_correcta: true},
            {clave: "A", texto: "16 años", es_correcta: false}
        ]
    }
];

// Función para obtener la "respuesta" tipo API según número de teléfono
export function getTriviaByAni(ani) {
    const usuario = usuariosData.find(u => u.ani === ani);
    if (!usuario) {
        return {status: false, message: "Usuario no encontrado"};
    }

    if (usuario.restantes <= 0) {
        return {
            status: true,
            result: {
                mensaje: "🚫 No te quedan más intentos",
                ani: usuario.ani,
                puntos_finales: usuario.puntos,
                restantes_finales: usuario.restantes
            }
        };
    }

    const preguntaData = preguntasData.find(p => p.id_pregunta === usuario.currentQuestion);
    if (!preguntaData) {
        return {status: false, message: "No hay preguntas disponibles"};
    }

    return {
        status: true,
        result: {
            PREGUNTA: {
                ID_TRIVIA: preguntaData.id_trivia,
                ID_PREGUNTA: preguntaData.id_pregunta,
                PREGUNTA: preguntaData.pregunta,
                RESPUESTAS: preguntaData.respuestas
            },
            PUNTOS: usuario.puntos,
            RESTANTES: usuario.restantes,
            TOTAL: usuario.total,
            CROSSELING: {
                mensaje: "❌ Te estás quedando sin preguntas!",
                link: "/packs"
            }
        }
    };
}

// Procesa la respuesta, actualiza puntos/restantes y trae la siguiente pregunta
export function pushRespuesta(ani, id_pregunta, clave) {
    // Asegurarse de que ani sea string para coincidir con input
    ani = String(ani);

    const usuario = usuariosData.find(u => String(u.ani) === ani);
    if (!usuario) return {status: false, message: "Usuario no encontrado"};

    const pregunta = preguntasData.find(p => p.id_pregunta === id_pregunta);
    if (!pregunta) return {status: false, message: "Pregunta no encontrada"};

    const respuesta = pregunta.respuestas.find(r => r.clave === clave);
    if (!respuesta) return {status: false, message: "Respuesta inválida"};

    // Inicializar currentQuestion si no existe
    if (usuario.currentQuestion === undefined) usuario.currentQuestion = 0;

    // --- 1) actualizar puntos ---
    usuario.puntos = usuario.puntos || 0;
    usuario.puntos += respuesta.es_correcta ? 10 : 5;

    // --- 2) restar 1 a restantes ---
    usuario.restantes = usuario.restantes || usuario.total;
    if (usuario.restantes > 0) usuario.restantes -= 1;

    // --- 3) avanzar a la siguiente pregunta ---
    usuario.currentQuestion += 1;
    const nextPregunta = preguntasData.find(p => p.id_pregunta === usuario.currentQuestion + 1);

    // Si no hay más preguntas, devolvemos fin
    if (!nextPregunta) {
        return {
            status: true,
            result: {
                mensaje: "🎉 Has terminado la trivia!",
                ani: usuario.ani,
                puntos_finales: usuario.puntos,
                restantes_finales: usuario.restantes
            }
        };
    }

    // --- 4) devolver respuesta + siguiente pregunta ---
    return {
        status: true,
        result: {
            RESPUESTA: {
                ani: usuario.ani,
                id_pregunta: pregunta.id_pregunta,
                clave: respuesta.clave,
                es_correcta: respuesta.es_correcta
            },
            PUNTOS: usuario.puntos,
            RESTANTES: usuario.restantes,
            TOTAL: usuario.total,
            NEXT_PREGUNTA: {
                ID_TRIVIA: nextPregunta.id_trivia,
                ID_PREGUNTA: nextPregunta.id_pregunta,
                PREGUNTA: nextPregunta.pregunta,
                RESPUESTAS: nextPregunta.respuestas
            }
        }
    };
}