import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import {
  Wallet, TrendingUp, TrendingDown, Plus, Trash2, Calendar,
  PieChart, BarChart3, Settings, ChevronLeft, ChevronRight,
  Download, Upload, X, Check, AlertCircle, Repeat, Zap, WifiOff, RefreshCw
} from 'lucide-react';

// ============ CATEGORÍAS POR DEFECTO ============
// Sin categorías por defecto — el usuario las crea o importa sugeridas
const DEFAULT_CATEGORIAS_GASTO = [];
const DEFAULT_CATEGORIAS_INGRESO = [];

// Categorías sugeridas estándar (el usuario puede importarlas con un botón)
const CATEGORIAS_SUGERIDAS_GASTO = [
  { id: 'vivienda', nombre: 'Vivienda', emoji: '🏠', color: '#E8B4B8', orden: 1 },
  { id: 'alimentacion', nombre: 'Alimentación', emoji: '🍽️', color: '#F4A261', orden: 2 },
  { id: 'transporte', nombre: 'Transporte', emoji: '🚌', color: '#2A9D8F', orden: 3 },
  { id: 'salud', nombre: 'Salud', emoji: '💊', color: '#06A77D', orden: 4 },
  { id: 'educacion', nombre: 'Educación', emoji: '📚', color: '#3A86FF', orden: 5 },
  { id: 'entretenimiento', nombre: 'Entretenimiento', emoji: '🎬', color: '#FF006E', orden: 6 },
  { id: 'ropa', nombre: 'Ropa', emoji: '👕', color: '#9D4EDD', orden: 7 },
  { id: 'suscripciones', nombre: 'Suscripciones', emoji: '📱', color: '#8338EC', orden: 8 },
  { id: 'deudas', nombre: 'Deudas', emoji: '💳', color: '#EF233C', orden: 9 },
  { id: 'ahorro', nombre: 'Ahorro', emoji: '💰', color: '#FFD60A', orden: 10 },
  { id: 'mascotas', nombre: 'Mascotas', emoji: '🐾', color: '#D4A373', orden: 11 },
  { id: 'otros', nombre: 'Otros', emoji: '📦', color: '#8D99AE', orden: 12 },
];

const CATEGORIAS_SUGERIDAS_INGRESO = [
  { id: 'salario', nombre: 'Salario', emoji: '💼', color: '#06A77D', orden: 1 },
  { id: 'freelance', nombre: 'Freelance / Extra', emoji: '💵', color: '#06D6A0', orden: 2 },
  { id: 'inversiones', nombre: 'Inversiones', emoji: '📈', color: '#3A86FF', orden: 3 },
  { id: 'bonos', nombre: 'Bonos / Regalos', emoji: '🎁', color: '#FF006E', orden: 4 },
];

const DEFAULT_CONFIG = {
  diaInicioMes: 23,
  ajustarFinDeSemana: true,
  moneda: 'S/.',
  persona: 'Sanat',
  tema: 'claro',
  acento: 'amber',
  pais: 'PE',
};

const PAISES_LATAM = [
  { code: 'PE', nombre: 'Perú', tz: 'America/Lima', moneda: 'S/.',  emoji: '🇵🇪' },
  { code: 'CO', nombre: 'Colombia', tz: 'America/Bogota', moneda: '$', emoji: '🇨🇴' },
  { code: 'EC', nombre: 'Ecuador', tz: 'America/Guayaquil', moneda: '$', emoji: '🇪🇨' },
  { code: 'MX', nombre: 'México', tz: 'America/Mexico_City', moneda: '$', emoji: '🇲🇽' },
  { code: 'CL', nombre: 'Chile', tz: 'America/Santiago', moneda: '$', emoji: '🇨🇱' },
  { code: 'AR', nombre: 'Argentina', tz: 'America/Argentina/Buenos_Aires', moneda: '$', emoji: '🇦🇷' },
  { code: 'BO', nombre: 'Bolivia', tz: 'America/La_Paz', moneda: 'Bs', emoji: '🇧🇴' },
  { code: 'PY', nombre: 'Paraguay', tz: 'America/Asuncion', moneda: '₲', emoji: '🇵🇾' },
  { code: 'UY', nombre: 'Uruguay', tz: 'America/Montevideo', moneda: '$', emoji: '🇺🇾' },
  { code: 'VE', nombre: 'Venezuela', tz: 'America/Caracas', moneda: 'Bs', emoji: '🇻🇪' },
  { code: 'BR', nombre: 'Brasil', tz: 'America/Sao_Paulo', moneda: 'R$', emoji: '🇧🇷' },
];

const getTZ = (paisCode) => (PAISES_LATAM.find(p => p.code === paisCode) || PAISES_LATAM[0]).tz;

const ACENTOS = {
  amber:   { label: 'Ámbar',     dot: '#d97706', text: 'text-amber-700',   italic: 'text-amber-700' },
  emerald: { label: 'Esmeralda', dot: '#059669', text: 'text-emerald-700', italic: 'text-emerald-700' },
  sky:     { label: 'Cielo',     dot: '#0284c7', text: 'text-sky-700',     italic: 'text-sky-700' },
  rose:    { label: 'Rosa',      dot: '#e11d48', text: 'text-rose-700',    italic: 'text-rose-700' },
  violet:  { label: 'Violeta',   dot: '#7c3aed', text: 'text-violet-700',  italic: 'text-violet-700' },
};

const SEED_DATA = [{"id":"seed_0001","tipo":"ingreso","tipoRegistro":"proyectado","categoria":"salario","subcategoria":"","detalle":"Auna","monto":3000.0,"fecha":"2026-04-23","persona":"Sanat","grupoId":"seedgrp_001"},{"id":"seed_0002","tipo":"ingreso","tipoRegistro":"proyectado","categoria":"salario","subcategoria":"","detalle":"Auna","monto":3000.0,"fecha":"2026-05-23","persona":"Sanat","grupoId":"seedgrp_001"},{"id":"seed_0003","tipo":"ingreso","tipoRegistro":"proyectado","categoria":"salario","subcategoria":"","detalle":"Auna","monto":3000.0,"fecha":"2026-06-23","persona":"Sanat","grupoId":"seedgrp_001"},{"id":"seed_0004","tipo":"ingreso","tipoRegistro":"proyectado","categoria":"salario","subcategoria":"","detalle":"Auna","monto":3000.0,"fecha":"2026-07-23","persona":"Sanat","grupoId":"seedgrp_001"},{"id":"seed_0005","tipo":"ingreso","tipoRegistro":"proyectado","categoria":"salario","subcategoria":"","detalle":"Auna","monto":3000.0,"fecha":"2026-08-23","persona":"Sanat","grupoId":"seedgrp_001"},{"id":"seed_0006","tipo":"ingreso","tipoRegistro":"proyectado","categoria":"salario","subcategoria":"","detalle":"Auna","monto":3000.0,"fecha":"2026-09-23","persona":"Sanat","grupoId":"seedgrp_001"},{"id":"seed_0007","tipo":"ingreso","tipoRegistro":"proyectado","categoria":"salario","subcategoria":"","detalle":"Auna","monto":3000.0,"fecha":"2026-10-23","persona":"Sanat","grupoId":"seedgrp_001"},{"id":"seed_0008","tipo":"ingreso","tipoRegistro":"proyectado","categoria":"salario","subcategoria":"","detalle":"Auna","monto":3000.0,"fecha":"2026-11-23","persona":"Sanat","grupoId":"seedgrp_001"},{"id":"seed_0009","tipo":"ingreso","tipoRegistro":"proyectado","categoria":"salario","subcategoria":"","detalle":"Auna","monto":3000.0,"fecha":"2026-12-23","persona":"Sanat","grupoId":"seedgrp_001"},{"id":"seed_0010","tipo":"ingreso","tipoRegistro":"proyectado","categoria":"salario","subcategoria":"","detalle":"Auna","monto":3000.0,"fecha":"2027-01-23","persona":"Sanat","grupoId":"seedgrp_001"},{"id":"seed_0011","tipo":"ingreso","tipoRegistro":"proyectado","categoria":"salario","subcategoria":"","detalle":"Auna","monto":3000.0,"fecha":"2027-02-23","persona":"Sanat","grupoId":"seedgrp_001"},{"id":"seed_0012","tipo":"ingreso","tipoRegistro":"proyectado","categoria":"salario","subcategoria":"","detalle":"Auna","monto":3000.0,"fecha":"2027-03-23","persona":"Sanat","grupoId":"seedgrp_001"},{"id":"seed_0013","tipo":"ingreso","tipoRegistro":"real","categoria":"salario","subcategoria":"","detalle":"Auna","monto":3000.0,"fecha":"2026-03-23","persona":"Sanat","grupoId":null},{"id":"seed_0014","tipo":"ingreso","tipoRegistro":"proyectado","categoria":"cts","subcategoria":"","detalle":"Auna","monto":2000.0,"fecha":"2026-05-15","persona":"Sanat","grupoId":"seedgrp_002"},{"id":"seed_0015","tipo":"ingreso","tipoRegistro":"proyectado","categoria":"cts","subcategoria":"","detalle":"Auna","monto":2000.0,"fecha":"2026-11-13","persona":"Sanat","grupoId":"seedgrp_002"},{"id":"seed_0016","tipo":"ingreso","tipoRegistro":"proyectado","categoria":"gratificacion","subcategoria":"","detalle":"Auna","monto":3800.0,"fecha":"2026-07-23","persona":"Sanat","grupoId":"seedgrp_003"},{"id":"seed_0017","tipo":"ingreso","tipoRegistro":"proyectado","categoria":"gratificacion","subcategoria":"","detalle":"Auna","monto":3800.0,"fecha":"2026-12-23","persona":"Sanat","grupoId":"seedgrp_003"},{"id":"seed_0018","tipo":"ingreso","tipoRegistro":"proyectado","categoria":"gratificacion","subcategoria":"Aguinaldo","detalle":"Auna","monto":200.0,"fecha":"2026-12-23","persona":"Sanat","grupoId":null},{"id":"seed_0019","tipo":"gasto","tipoRegistro":"proyectado","categoria":"fijos_vivienda","subcategoria":"Servicios","detalle":"Agua","monto":50.0,"fecha":"2026-03-30","persona":"Sanat","grupoId":"seedgrp_004"},{"id":"seed_0020","tipo":"gasto","tipoRegistro":"proyectado","categoria":"fijos_vivienda","subcategoria":"Servicios","detalle":"Agua","monto":50.0,"fecha":"2026-04-30","persona":"Sanat","grupoId":"seedgrp_004"},{"id":"seed_0021","tipo":"gasto","tipoRegistro":"proyectado","categoria":"fijos_vivienda","subcategoria":"Servicios","detalle":"Agua","monto":50.0,"fecha":"2026-05-30","persona":"Sanat","grupoId":"seedgrp_004"},{"id":"seed_0022","tipo":"gasto","tipoRegistro":"proyectado","categoria":"fijos_vivienda","subcategoria":"Servicios","detalle":"Agua","monto":50.0,"fecha":"2026-06-30","persona":"Sanat","grupoId":"seedgrp_004"},{"id":"seed_0023","tipo":"gasto","tipoRegistro":"proyectado","categoria":"fijos_vivienda","subcategoria":"Servicios","detalle":"Agua","monto":50.0,"fecha":"2026-07-30","persona":"Sanat","grupoId":"seedgrp_004"},{"id":"seed_0024","tipo":"gasto","tipoRegistro":"proyectado","categoria":"fijos_vivienda","subcategoria":"Servicios","detalle":"Agua","monto":50.0,"fecha":"2026-08-30","persona":"Sanat","grupoId":"seedgrp_004"},{"id":"seed_0025","tipo":"gasto","tipoRegistro":"proyectado","categoria":"fijos_vivienda","subcategoria":"Servicios","detalle":"Agua","monto":50.0,"fecha":"2026-09-30","persona":"Sanat","grupoId":"seedgrp_004"},{"id":"seed_0026","tipo":"gasto","tipoRegistro":"proyectado","categoria":"fijos_vivienda","subcategoria":"Servicios","detalle":"Agua","monto":50.0,"fecha":"2026-10-30","persona":"Sanat","grupoId":"seedgrp_004"},{"id":"seed_0027","tipo":"gasto","tipoRegistro":"proyectado","categoria":"fijos_vivienda","subcategoria":"Servicios","detalle":"Agua","monto":50.0,"fecha":"2026-11-30","persona":"Sanat","grupoId":"seedgrp_004"},{"id":"seed_0028","tipo":"gasto","tipoRegistro":"proyectado","categoria":"fijos_vivienda","subcategoria":"Servicios","detalle":"Agua","monto":50.0,"fecha":"2026-12-30","persona":"Sanat","grupoId":"seedgrp_004"},{"id":"seed_0029","tipo":"gasto","tipoRegistro":"proyectado","categoria":"fijos_vivienda","subcategoria":"Servicios","detalle":"Agua","monto":50.0,"fecha":"2027-01-30","persona":"Sanat","grupoId":"seedgrp_004"},{"id":"seed_0030","tipo":"gasto","tipoRegistro":"proyectado","categoria":"fijos_vivienda","subcategoria":"Servicios","detalle":"Agua","monto":50.0,"fecha":"2027-02-28","persona":"Sanat","grupoId":"seedgrp_004"},{"id":"seed_0031","tipo":"gasto","tipoRegistro":"proyectado","categoria":"alimentacion","subcategoria":"Comida Casa","detalle":"Dinero","monto":450.0,"fecha":"2026-03-24","persona":"Sanat","grupoId":"seedgrp_005"},{"id":"seed_0032","tipo":"gasto","tipoRegistro":"proyectado","categoria":"alimentacion","subcategoria":"Comida Casa","detalle":"Dinero","monto":450.0,"fecha":"2026-04-24","persona":"Sanat","grupoId":"seedgrp_005"},{"id":"seed_0033","tipo":"gasto","tipoRegistro":"proyectado","categoria":"alimentacion","subcategoria":"Comida Casa","detalle":"Dinero","monto":450.0,"fecha":"2026-05-24","persona":"Sanat","grupoId":"seedgrp_005"},{"id":"seed_0034","tipo":"gasto","tipoRegistro":"proyectado","categoria":"alimentacion","subcategoria":"Comida Casa","detalle":"Dinero","monto":450.0,"fecha":"2026-06-24","persona":"Sanat","grupoId":"seedgrp_005"},{"id":"seed_0035","tipo":"gasto","tipoRegistro":"proyectado","categoria":"alimentacion","subcategoria":"Comida Casa","detalle":"Dinero","monto":450.0,"fecha":"2026-07-24","persona":"Sanat","grupoId":"seedgrp_005"},{"id":"seed_0036","tipo":"gasto","tipoRegistro":"proyectado","categoria":"alimentacion","subcategoria":"Comida Casa","detalle":"Dinero","monto":450.0,"fecha":"2026-08-24","persona":"Sanat","grupoId":"seedgrp_005"},{"id":"seed_0037","tipo":"gasto","tipoRegistro":"proyectado","categoria":"alimentacion","subcategoria":"Comida Casa","detalle":"Dinero","monto":450.0,"fecha":"2026-09-24","persona":"Sanat","grupoId":"seedgrp_005"},{"id":"seed_0038","tipo":"gasto","tipoRegistro":"proyectado","categoria":"alimentacion","subcategoria":"Comida Casa","detalle":"Dinero","monto":450.0,"fecha":"2026-10-24","persona":"Sanat","grupoId":"seedgrp_005"},{"id":"seed_0039","tipo":"gasto","tipoRegistro":"proyectado","categoria":"alimentacion","subcategoria":"Comida Casa","detalle":"Dinero","monto":450.0,"fecha":"2026-11-24","persona":"Sanat","grupoId":"seedgrp_005"},{"id":"seed_0040","tipo":"gasto","tipoRegistro":"proyectado","categoria":"alimentacion","subcategoria":"Comida Casa","detalle":"Dinero","monto":450.0,"fecha":"2026-12-24","persona":"Sanat","grupoId":"seedgrp_005"},{"id":"seed_0041","tipo":"gasto","tipoRegistro":"proyectado","categoria":"alimentacion","subcategoria":"Comida Casa","detalle":"Dinero","monto":450.0,"fecha":"2027-01-24","persona":"Sanat","grupoId":"seedgrp_005"},{"id":"seed_0042","tipo":"gasto","tipoRegistro":"proyectado","categoria":"alimentacion","subcategoria":"Comida Casa","detalle":"Dinero","monto":450.0,"fecha":"2027-02-24","persona":"Sanat","grupoId":"seedgrp_005"},{"id":"seed_0043","tipo":"gasto","tipoRegistro":"real","categoria":"casa_padres","subcategoria":"Comida","detalle":"Alimento","monto":20.0,"fecha":"2026-03-26","persona":"Sanat","grupoId":null},{"id":"seed_0044","tipo":"gasto","tipoRegistro":"proyectado","categoria":"ahorro","subcategoria":"Ahorro Carro","detalle":"Segunda Toyota","monto":400.0,"fecha":"2026-04-24","persona":"Sanat","grupoId":"seedgrp_006"},{"id":"seed_0045","tipo":"gasto","tipoRegistro":"proyectado","categoria":"ahorro","subcategoria":"Ahorro Carro","detalle":"Segunda Toyota","monto":400.0,"fecha":"2026-05-24","persona":"Sanat","grupoId":"seedgrp_006"},{"id":"seed_0046","tipo":"gasto","tipoRegistro":"proyectado","categoria":"ahorro","subcategoria":"Ahorro Carro","detalle":"Segunda Toyota","monto":400.0,"fecha":"2026-06-24","persona":"Sanat","grupoId":"seedgrp_006"},{"id":"seed_0047","tipo":"gasto","tipoRegistro":"proyectado","categoria":"ahorro","subcategoria":"Ahorro Carro","detalle":"Segunda Toyota","monto":400.0,"fecha":"2026-07-24","persona":"Sanat","grupoId":"seedgrp_006"},{"id":"seed_0048","tipo":"gasto","tipoRegistro":"proyectado","categoria":"ahorro","subcategoria":"Ahorro Carro","detalle":"Segunda Toyota","monto":400.0,"fecha":"2026-08-24","persona":"Sanat","grupoId":"seedgrp_006"},{"id":"seed_0049","tipo":"gasto","tipoRegistro":"proyectado","categoria":"ahorro","subcategoria":"Ahorro Carro","detalle":"Segunda Toyota","monto":400.0,"fecha":"2026-09-24","persona":"Sanat","grupoId":"seedgrp_006"},{"id":"seed_0050","tipo":"gasto","tipoRegistro":"proyectado","categoria":"ahorro","subcategoria":"Ahorro Carro","detalle":"Segunda Toyota","monto":400.0,"fecha":"2026-10-24","persona":"Sanat","grupoId":"seedgrp_006"},{"id":"seed_0051","tipo":"gasto","tipoRegistro":"proyectado","categoria":"ahorro","subcategoria":"Ahorro Carro","detalle":"Segunda Toyota","monto":400.0,"fecha":"2026-11-24","persona":"Sanat","grupoId":"seedgrp_006"},{"id":"seed_0052","tipo":"gasto","tipoRegistro":"proyectado","categoria":"ahorro","subcategoria":"Ahorro Carro","detalle":"Segunda Toyota","monto":400.0,"fecha":"2026-12-24","persona":"Sanat","grupoId":"seedgrp_006"},{"id":"seed_0053","tipo":"gasto","tipoRegistro":"proyectado","categoria":"ahorro","subcategoria":"Ahorro Carro","detalle":"Segunda Toyota","monto":400.0,"fecha":"2027-01-24","persona":"Sanat","grupoId":"seedgrp_006"},{"id":"seed_0054","tipo":"gasto","tipoRegistro":"proyectado","categoria":"ahorro","subcategoria":"Ahorro Carro","detalle":"Segunda Toyota","monto":400.0,"fecha":"2027-02-24","persona":"Sanat","grupoId":"seedgrp_006"},{"id":"seed_0055","tipo":"gasto","tipoRegistro":"proyectado","categoria":"ahorro","subcategoria":"Ahorro Carro","detalle":"Segunda Toyota","monto":400.0,"fecha":"2027-03-24","persona":"Sanat","grupoId":"seedgrp_006"},{"id":"seed_0056","tipo":"gasto","tipoRegistro":"proyectado","categoria":"inversion","subcategoria":"Lovable","detalle":"","monto":200.0,"fecha":"2026-04-23","persona":"Sanat","grupoId":"seedgrp_007"},{"id":"seed_0057","tipo":"gasto","tipoRegistro":"proyectado","categoria":"inversion","subcategoria":"Lovable","detalle":"","monto":200.0,"fecha":"2026-05-23","persona":"Sanat","grupoId":"seedgrp_007"},{"id":"seed_0058","tipo":"gasto","tipoRegistro":"proyectado","categoria":"inversion","subcategoria":"Lovable","detalle":"","monto":200.0,"fecha":"2026-06-23","persona":"Sanat","grupoId":"seedgrp_007"},{"id":"seed_0059","tipo":"gasto","tipoRegistro":"proyectado","categoria":"inversion","subcategoria":"Lovable","detalle":"","monto":200.0,"fecha":"2026-07-23","persona":"Sanat","grupoId":"seedgrp_007"},{"id":"seed_0060","tipo":"gasto","tipoRegistro":"proyectado","categoria":"inversion","subcategoria":"Lovable","detalle":"","monto":200.0,"fecha":"2026-08-23","persona":"Sanat","grupoId":"seedgrp_007"},{"id":"seed_0061","tipo":"gasto","tipoRegistro":"proyectado","categoria":"inversion","subcategoria":"Lovable","detalle":"","monto":200.0,"fecha":"2026-09-23","persona":"Sanat","grupoId":"seedgrp_007"},{"id":"seed_0062","tipo":"gasto","tipoRegistro":"proyectado","categoria":"inversion","subcategoria":"Lovable","detalle":"","monto":200.0,"fecha":"2026-10-23","persona":"Sanat","grupoId":"seedgrp_007"},{"id":"seed_0063","tipo":"gasto","tipoRegistro":"proyectado","categoria":"inversion","subcategoria":"Lovable","detalle":"","monto":200.0,"fecha":"2026-11-23","persona":"Sanat","grupoId":"seedgrp_007"},{"id":"seed_0064","tipo":"gasto","tipoRegistro":"proyectado","categoria":"inversion","subcategoria":"Lovable","detalle":"","monto":200.0,"fecha":"2026-12-23","persona":"Sanat","grupoId":"seedgrp_007"},{"id":"seed_0065","tipo":"gasto","tipoRegistro":"proyectado","categoria":"inversion","subcategoria":"Lovable","detalle":"","monto":200.0,"fecha":"2027-01-23","persona":"Sanat","grupoId":"seedgrp_007"},{"id":"seed_0066","tipo":"gasto","tipoRegistro":"proyectado","categoria":"inversion","subcategoria":"Lovable","detalle":"","monto":200.0,"fecha":"2027-02-23","persona":"Sanat","grupoId":"seedgrp_007"},{"id":"seed_0067","tipo":"gasto","tipoRegistro":"proyectado","categoria":"inversion","subcategoria":"Lovable","detalle":"","monto":200.0,"fecha":"2027-03-23","persona":"Sanat","grupoId":"seedgrp_007"},{"id":"seed_0068","tipo":"gasto","tipoRegistro":"real","categoria":"casa_padres","subcategoria":"Servicios","detalle":"Luz 654822","monto":328.4,"fecha":"2026-03-24","persona":"Sanat","grupoId":null},{"id":"seed_0069","tipo":"gasto","tipoRegistro":"proyectado","categoria":"casa_padres","subcategoria":"Mamá","detalle":"Luz 654822","monto":300.0,"fecha":"2026-03-23","persona":"Sanat","grupoId":"seedgrp_008"},{"id":"seed_0070","tipo":"gasto","tipoRegistro":"proyectado","categoria":"casa_padres","subcategoria":"Mamá","detalle":"Luz 654822","monto":300.0,"fecha":"2026-04-23","persona":"Sanat","grupoId":"seedgrp_008"},{"id":"seed_0071","tipo":"gasto","tipoRegistro":"proyectado","categoria":"casa_padres","subcategoria":"Mamá","detalle":"Luz 654822","monto":300.0,"fecha":"2026-05-23","persona":"Sanat","grupoId":"seedgrp_008"},{"id":"seed_0072","tipo":"gasto","tipoRegistro":"proyectado","categoria":"casa_padres","subcategoria":"Mamá","detalle":"Luz 654822","monto":300.0,"fecha":"2026-06-23","persona":"Sanat","grupoId":"seedgrp_008"},{"id":"seed_0073","tipo":"gasto","tipoRegistro":"proyectado","categoria":"casa_padres","subcategoria":"Mamá","detalle":"Luz 654822","monto":300.0,"fecha":"2026-07-23","persona":"Sanat","grupoId":"seedgrp_008"},{"id":"seed_0074","tipo":"gasto","tipoRegistro":"proyectado","categoria":"casa_padres","subcategoria":"Mamá","detalle":"Luz 654822","monto":300.0,"fecha":"2026-08-23","persona":"Sanat","grupoId":"seedgrp_008"},{"id":"seed_0075","tipo":"gasto","tipoRegistro":"proyectado","categoria":"casa_padres","subcategoria":"Mamá","detalle":"Luz 654822","monto":300.0,"fecha":"2026-09-23","persona":"Sanat","grupoId":"seedgrp_008"},{"id":"seed_0076","tipo":"gasto","tipoRegistro":"proyectado","categoria":"casa_padres","subcategoria":"Mamá","detalle":"Luz 654822","monto":300.0,"fecha":"2026-10-23","persona":"Sanat","grupoId":"seedgrp_008"},{"id":"seed_0077","tipo":"gasto","tipoRegistro":"proyectado","categoria":"casa_padres","subcategoria":"Mamá","detalle":"Luz 654822","monto":300.0,"fecha":"2026-11-23","persona":"Sanat","grupoId":"seedgrp_008"},{"id":"seed_0078","tipo":"gasto","tipoRegistro":"proyectado","categoria":"casa_padres","subcategoria":"Mamá","detalle":"Luz 654822","monto":300.0,"fecha":"2026-12-23","persona":"Sanat","grupoId":"seedgrp_008"},{"id":"seed_0079","tipo":"gasto","tipoRegistro":"proyectado","categoria":"casa_padres","subcategoria":"Mamá","detalle":"Luz 654822","monto":300.0,"fecha":"2027-01-23","persona":"Sanat","grupoId":"seedgrp_008"},{"id":"seed_0080","tipo":"gasto","tipoRegistro":"proyectado","categoria":"casa_padres","subcategoria":"Mamá","detalle":"Luz 654822","monto":300.0,"fecha":"2027-02-23","persona":"Sanat","grupoId":"seedgrp_008"},{"id":"seed_0081","tipo":"gasto","tipoRegistro":"proyectado","categoria":"transporte","subcategoria":"Varios","detalle":"Bus/Tren/Taxi","monto":200.0,"fecha":"2026-03-23","persona":"Sanat","grupoId":"seedgrp_009"},{"id":"seed_0082","tipo":"gasto","tipoRegistro":"proyectado","categoria":"transporte","subcategoria":"Varios","detalle":"Bus/Tren/Taxi","monto":200.0,"fecha":"2026-04-23","persona":"Sanat","grupoId":"seedgrp_009"},{"id":"seed_0083","tipo":"gasto","tipoRegistro":"proyectado","categoria":"transporte","subcategoria":"Varios","detalle":"Bus/Tren/Taxi","monto":200.0,"fecha":"2026-05-23","persona":"Sanat","grupoId":"seedgrp_009"},{"id":"seed_0084","tipo":"gasto","tipoRegistro":"proyectado","categoria":"transporte","subcategoria":"Varios","detalle":"Bus/Tren/Taxi","monto":200.0,"fecha":"2026-06-23","persona":"Sanat","grupoId":"seedgrp_009"},{"id":"seed_0085","tipo":"gasto","tipoRegistro":"proyectado","categoria":"transporte","subcategoria":"Varios","detalle":"Bus/Tren/Taxi","monto":200.0,"fecha":"2026-07-23","persona":"Sanat","grupoId":"seedgrp_009"},{"id":"seed_0086","tipo":"gasto","tipoRegistro":"proyectado","categoria":"transporte","subcategoria":"Varios","detalle":"Bus/Tren/Taxi","monto":200.0,"fecha":"2026-08-23","persona":"Sanat","grupoId":"seedgrp_009"},{"id":"seed_0087","tipo":"gasto","tipoRegistro":"proyectado","categoria":"transporte","subcategoria":"Varios","detalle":"Bus/Tren/Taxi","monto":200.0,"fecha":"2026-09-23","persona":"Sanat","grupoId":"seedgrp_009"},{"id":"seed_0088","tipo":"gasto","tipoRegistro":"proyectado","categoria":"transporte","subcategoria":"Varios","detalle":"Bus/Tren/Taxi","monto":200.0,"fecha":"2026-10-23","persona":"Sanat","grupoId":"seedgrp_009"},{"id":"seed_0089","tipo":"gasto","tipoRegistro":"proyectado","categoria":"transporte","subcategoria":"Varios","detalle":"Bus/Tren/Taxi","monto":200.0,"fecha":"2026-11-23","persona":"Sanat","grupoId":"seedgrp_009"},{"id":"seed_0090","tipo":"gasto","tipoRegistro":"proyectado","categoria":"transporte","subcategoria":"Varios","detalle":"Bus/Tren/Taxi","monto":200.0,"fecha":"2026-12-23","persona":"Sanat","grupoId":"seedgrp_009"},{"id":"seed_0091","tipo":"gasto","tipoRegistro":"proyectado","categoria":"transporte","subcategoria":"Varios","detalle":"Bus/Tren/Taxi","monto":200.0,"fecha":"2027-01-23","persona":"Sanat","grupoId":"seedgrp_009"},{"id":"seed_0092","tipo":"gasto","tipoRegistro":"proyectado","categoria":"transporte","subcategoria":"Varios","detalle":"Bus/Tren/Taxi","monto":200.0,"fecha":"2027-02-23","persona":"Sanat","grupoId":"seedgrp_009"},{"id":"seed_0093","tipo":"gasto","tipoRegistro":"real","categoria":"alimentacion","subcategoria":"Comida Casa","detalle":"Dinero","monto":450.0,"fecha":"2026-03-24","persona":"Sanat","grupoId":null},{"id":"seed_0094","tipo":"gasto","tipoRegistro":"proyectado","categoria":"otros","subcategoria":"Salida Familiar","detalle":"","monto":200.0,"fecha":"2026-03-23","persona":"Sanat","grupoId":"seedgrp_010"},{"id":"seed_0095","tipo":"gasto","tipoRegistro":"proyectado","categoria":"otros","subcategoria":"Salida Familiar","detalle":"","monto":200.0,"fecha":"2026-04-23","persona":"Sanat","grupoId":"seedgrp_010"},{"id":"seed_0096","tipo":"gasto","tipoRegistro":"proyectado","categoria":"otros","subcategoria":"Salida Familiar","detalle":"","monto":200.0,"fecha":"2026-05-23","persona":"Sanat","grupoId":"seedgrp_010"},{"id":"seed_0097","tipo":"gasto","tipoRegistro":"proyectado","categoria":"otros","subcategoria":"Salida Familiar","detalle":"","monto":200.0,"fecha":"2026-06-23","persona":"Sanat","grupoId":"seedgrp_010"},{"id":"seed_0098","tipo":"gasto","tipoRegistro":"proyectado","categoria":"otros","subcategoria":"Salida Familiar","detalle":"","monto":200.0,"fecha":"2026-07-23","persona":"Sanat","grupoId":"seedgrp_010"},{"id":"seed_0099","tipo":"gasto","tipoRegistro":"proyectado","categoria":"otros","subcategoria":"Salida Familiar","detalle":"","monto":200.0,"fecha":"2026-08-23","persona":"Sanat","grupoId":"seedgrp_010"},{"id":"seed_0100","tipo":"gasto","tipoRegistro":"proyectado","categoria":"otros","subcategoria":"Salida Familiar","detalle":"","monto":200.0,"fecha":"2026-09-23","persona":"Sanat","grupoId":"seedgrp_010"},{"id":"seed_0101","tipo":"gasto","tipoRegistro":"proyectado","categoria":"otros","subcategoria":"Salida Familiar","detalle":"","monto":200.0,"fecha":"2026-10-23","persona":"Sanat","grupoId":"seedgrp_010"},{"id":"seed_0102","tipo":"gasto","tipoRegistro":"proyectado","categoria":"otros","subcategoria":"Salida Familiar","detalle":"","monto":200.0,"fecha":"2026-11-23","persona":"Sanat","grupoId":"seedgrp_010"},{"id":"seed_0103","tipo":"gasto","tipoRegistro":"proyectado","categoria":"otros","subcategoria":"Salida Familiar","detalle":"","monto":200.0,"fecha":"2026-12-23","persona":"Sanat","grupoId":"seedgrp_010"},{"id":"seed_0104","tipo":"gasto","tipoRegistro":"proyectado","categoria":"otros","subcategoria":"Salida Familiar","detalle":"","monto":200.0,"fecha":"2027-01-23","persona":"Sanat","grupoId":"seedgrp_010"},{"id":"seed_0105","tipo":"gasto","tipoRegistro":"proyectado","categoria":"otros","subcategoria":"Salida Familiar","detalle":"","monto":200.0,"fecha":"2027-02-23","persona":"Sanat","grupoId":"seedgrp_010"},{"id":"seed_0106","tipo":"gasto","tipoRegistro":"real","categoria":"fijos_vivienda","subcategoria":"Servicios","detalle":"Agua","monto":60.0,"fecha":"2026-04-08","persona":"Sanat","grupoId":null},{"id":"seed_0107","tipo":"gasto","tipoRegistro":"proyectado","categoria":"casa_padres","subcategoria":"Comida","detalle":"Alimento","monto":60.0,"fecha":"2026-03-25","persona":"Sanat","grupoId":"seedgrp_011"},{"id":"seed_0108","tipo":"gasto","tipoRegistro":"proyectado","categoria":"casa_padres","subcategoria":"Comida","detalle":"Alimento","monto":60.0,"fecha":"2026-04-25","persona":"Sanat","grupoId":"seedgrp_011"},{"id":"seed_0109","tipo":"gasto","tipoRegistro":"proyectado","categoria":"casa_padres","subcategoria":"Comida","detalle":"Alimento","monto":60.0,"fecha":"2026-05-25","persona":"Sanat","grupoId":"seedgrp_011"},{"id":"seed_0110","tipo":"gasto","tipoRegistro":"proyectado","categoria":"casa_padres","subcategoria":"Comida","detalle":"Alimento","monto":60.0,"fecha":"2026-06-25","persona":"Sanat","grupoId":"seedgrp_011"},{"id":"seed_0111","tipo":"gasto","tipoRegistro":"proyectado","categoria":"casa_padres","subcategoria":"Comida","detalle":"Alimento","monto":60.0,"fecha":"2026-07-25","persona":"Sanat","grupoId":"seedgrp_011"},{"id":"seed_0112","tipo":"gasto","tipoRegistro":"proyectado","categoria":"casa_padres","subcategoria":"Comida","detalle":"Alimento","monto":60.0,"fecha":"2026-08-25","persona":"Sanat","grupoId":"seedgrp_011"},{"id":"seed_0113","tipo":"gasto","tipoRegistro":"proyectado","categoria":"casa_padres","subcategoria":"Comida","detalle":"Alimento","monto":60.0,"fecha":"2026-09-25","persona":"Sanat","grupoId":"seedgrp_011"},{"id":"seed_0114","tipo":"gasto","tipoRegistro":"proyectado","categoria":"casa_padres","subcategoria":"Comida","detalle":"Alimento","monto":60.0,"fecha":"2026-10-25","persona":"Sanat","grupoId":"seedgrp_011"},{"id":"seed_0115","tipo":"gasto","tipoRegistro":"proyectado","categoria":"casa_padres","subcategoria":"Comida","detalle":"Alimento","monto":60.0,"fecha":"2026-11-25","persona":"Sanat","grupoId":"seedgrp_011"},{"id":"seed_0116","tipo":"gasto","tipoRegistro":"proyectado","categoria":"casa_padres","subcategoria":"Comida","detalle":"Alimento","monto":60.0,"fecha":"2026-12-25","persona":"Sanat","grupoId":"seedgrp_011"},{"id":"seed_0117","tipo":"gasto","tipoRegistro":"proyectado","categoria":"casa_padres","subcategoria":"Comida","detalle":"Alimento","monto":60.0,"fecha":"2027-01-25","persona":"Sanat","grupoId":"seedgrp_011"},{"id":"seed_0118","tipo":"gasto","tipoRegistro":"proyectado","categoria":"casa_padres","subcategoria":"Comida","detalle":"Alimento","monto":60.0,"fecha":"2027-02-25","persona":"Sanat","grupoId":"seedgrp_011"},{"id":"seed_0119","tipo":"gasto","tipoRegistro":"proyectado","categoria":"fijos_vivienda","subcategoria":"Servicios","detalle":"Internet","monto":60.0,"fecha":"2026-04-10","persona":"Sanat","grupoId":"seedgrp_012"},{"id":"seed_0120","tipo":"gasto","tipoRegistro":"proyectado","categoria":"fijos_vivienda","subcategoria":"Servicios","detalle":"Internet","monto":60.0,"fecha":"2026-05-10","persona":"Sanat","grupoId":"seedgrp_012"},{"id":"seed_0121","tipo":"gasto","tipoRegistro":"proyectado","categoria":"fijos_vivienda","subcategoria":"Servicios","detalle":"Internet","monto":60.0,"fecha":"2026-06-10","persona":"Sanat","grupoId":"seedgrp_012"},{"id":"seed_0122","tipo":"gasto","tipoRegistro":"proyectado","categoria":"fijos_vivienda","subcategoria":"Servicios","detalle":"Internet","monto":60.0,"fecha":"2026-07-10","persona":"Sanat","grupoId":"seedgrp_012"},{"id":"seed_0123","tipo":"gasto","tipoRegistro":"proyectado","categoria":"fijos_vivienda","subcategoria":"Servicios","detalle":"Internet","monto":60.0,"fecha":"2026-08-10","persona":"Sanat","grupoId":"seedgrp_012"},{"id":"seed_0124","tipo":"gasto","tipoRegistro":"proyectado","categoria":"fijos_vivienda","subcategoria":"Servicios","detalle":"Internet","monto":60.0,"fecha":"2026-09-10","persona":"Sanat","grupoId":"seedgrp_012"},{"id":"seed_0125","tipo":"gasto","tipoRegistro":"proyectado","categoria":"fijos_vivienda","subcategoria":"Servicios","detalle":"Internet","monto":60.0,"fecha":"2026-10-10","persona":"Sanat","grupoId":"seedgrp_012"},{"id":"seed_0126","tipo":"gasto","tipoRegistro":"proyectado","categoria":"fijos_vivienda","subcategoria":"Servicios","detalle":"Internet","monto":60.0,"fecha":"2026-11-10","persona":"Sanat","grupoId":"seedgrp_012"},{"id":"seed_0127","tipo":"gasto","tipoRegistro":"proyectado","categoria":"fijos_vivienda","subcategoria":"Servicios","detalle":"Internet","monto":60.0,"fecha":"2026-12-10","persona":"Sanat","grupoId":"seedgrp_012"},{"id":"seed_0128","tipo":"gasto","tipoRegistro":"proyectado","categoria":"fijos_vivienda","subcategoria":"Servicios","detalle":"Internet","monto":60.0,"fecha":"2027-01-10","persona":"Sanat","grupoId":"seedgrp_012"},{"id":"seed_0129","tipo":"gasto","tipoRegistro":"proyectado","categoria":"fijos_vivienda","subcategoria":"Servicios","detalle":"Internet","monto":60.0,"fecha":"2027-02-10","persona":"Sanat","grupoId":"seedgrp_012"},{"id":"seed_0130","tipo":"gasto","tipoRegistro":"proyectado","categoria":"fijos_vivienda","subcategoria":"Servicios","detalle":"Internet","monto":60.0,"fecha":"2027-03-10","persona":"Sanat","grupoId":"seedgrp_012"},{"id":"seed_0131","tipo":"gasto","tipoRegistro":"proyectado","categoria":"fijos_vivienda","subcategoria":"Servicios","detalle":"Luz","monto":90.0,"fecha":"2026-03-30","persona":"Sanat","grupoId":"seedgrp_013"},{"id":"seed_0132","tipo":"gasto","tipoRegistro":"proyectado","categoria":"fijos_vivienda","subcategoria":"Servicios","detalle":"Luz","monto":90.0,"fecha":"2026-04-30","persona":"Sanat","grupoId":"seedgrp_013"},{"id":"seed_0133","tipo":"gasto","tipoRegistro":"proyectado","categoria":"fijos_vivienda","subcategoria":"Servicios","detalle":"Luz","monto":90.0,"fecha":"2026-05-30","persona":"Sanat","grupoId":"seedgrp_013"},{"id":"seed_0134","tipo":"gasto","tipoRegistro":"proyectado","categoria":"fijos_vivienda","subcategoria":"Servicios","detalle":"Luz","monto":90.0,"fecha":"2026-06-30","persona":"Sanat","grupoId":"seedgrp_013"},{"id":"seed_0135","tipo":"gasto","tipoRegistro":"proyectado","categoria":"fijos_vivienda","subcategoria":"Servicios","detalle":"Luz","monto":90.0,"fecha":"2026-07-30","persona":"Sanat","grupoId":"seedgrp_013"},{"id":"seed_0136","tipo":"gasto","tipoRegistro":"proyectado","categoria":"fijos_vivienda","subcategoria":"Servicios","detalle":"Luz","monto":90.0,"fecha":"2026-08-30","persona":"Sanat","grupoId":"seedgrp_013"},{"id":"seed_0137","tipo":"gasto","tipoRegistro":"proyectado","categoria":"fijos_vivienda","subcategoria":"Servicios","detalle":"Luz","monto":90.0,"fecha":"2026-09-30","persona":"Sanat","grupoId":"seedgrp_013"},{"id":"seed_0138","tipo":"gasto","tipoRegistro":"proyectado","categoria":"fijos_vivienda","subcategoria":"Servicios","detalle":"Luz","monto":90.0,"fecha":"2026-10-30","persona":"Sanat","grupoId":"seedgrp_013"},{"id":"seed_0139","tipo":"gasto","tipoRegistro":"proyectado","categoria":"fijos_vivienda","subcategoria":"Servicios","detalle":"Luz","monto":90.0,"fecha":"2026-11-30","persona":"Sanat","grupoId":"seedgrp_013"},{"id":"seed_0140","tipo":"gasto","tipoRegistro":"proyectado","categoria":"fijos_vivienda","subcategoria":"Servicios","detalle":"Luz","monto":90.0,"fecha":"2026-12-30","persona":"Sanat","grupoId":"seedgrp_013"},{"id":"seed_0141","tipo":"gasto","tipoRegistro":"proyectado","categoria":"fijos_vivienda","subcategoria":"Servicios","detalle":"Luz","monto":90.0,"fecha":"2027-01-30","persona":"Sanat","grupoId":"seedgrp_013"},{"id":"seed_0142","tipo":"gasto","tipoRegistro":"proyectado","categoria":"fijos_vivienda","subcategoria":"Servicios","detalle":"Luz","monto":90.0,"fecha":"2027-02-28","persona":"Sanat","grupoId":"seedgrp_013"},{"id":"seed_0143","tipo":"gasto","tipoRegistro":"proyectado","categoria":"transporte","subcategoria":"Trabajo","detalle":"Bus/Tren","monto":50.0,"fecha":"2026-03-23","persona":"Sanat","grupoId":"seedgrp_014"},{"id":"seed_0144","tipo":"gasto","tipoRegistro":"proyectado","categoria":"transporte","subcategoria":"Trabajo","detalle":"Bus/Tren","monto":50.0,"fecha":"2026-04-23","persona":"Sanat","grupoId":"seedgrp_014"},{"id":"seed_0145","tipo":"gasto","tipoRegistro":"proyectado","categoria":"transporte","subcategoria":"Trabajo","detalle":"Bus/Tren","monto":50.0,"fecha":"2026-05-23","persona":"Sanat","grupoId":"seedgrp_014"},{"id":"seed_0146","tipo":"gasto","tipoRegistro":"proyectado","categoria":"transporte","subcategoria":"Trabajo","detalle":"Bus/Tren","monto":50.0,"fecha":"2026-06-23","persona":"Sanat","grupoId":"seedgrp_014"},{"id":"seed_0147","tipo":"gasto","tipoRegistro":"proyectado","categoria":"transporte","subcategoria":"Trabajo","detalle":"Bus/Tren","monto":50.0,"fecha":"2026-07-23","persona":"Sanat","grupoId":"seedgrp_014"},{"id":"seed_0148","tipo":"gasto","tipoRegistro":"proyectado","categoria":"transporte","subcategoria":"Trabajo","detalle":"Bus/Tren","monto":50.0,"fecha":"2026-08-23","persona":"Sanat","grupoId":"seedgrp_014"},{"id":"seed_0149","tipo":"gasto","tipoRegistro":"proyectado","categoria":"transporte","subcategoria":"Trabajo","detalle":"Bus/Tren","monto":50.0,"fecha":"2026-09-23","persona":"Sanat","grupoId":"seedgrp_014"},{"id":"seed_0150","tipo":"gasto","tipoRegistro":"proyectado","categoria":"transporte","subcategoria":"Trabajo","detalle":"Bus/Tren","monto":50.0,"fecha":"2026-10-23","persona":"Sanat","grupoId":"seedgrp_014"},{"id":"seed_0151","tipo":"gasto","tipoRegistro":"proyectado","categoria":"transporte","subcategoria":"Trabajo","detalle":"Bus/Tren","monto":50.0,"fecha":"2026-11-23","persona":"Sanat","grupoId":"seedgrp_014"},{"id":"seed_0152","tipo":"gasto","tipoRegistro":"proyectado","categoria":"transporte","subcategoria":"Trabajo","detalle":"Bus/Tren","monto":50.0,"fecha":"2026-12-23","persona":"Sanat","grupoId":"seedgrp_014"},{"id":"seed_0153","tipo":"gasto","tipoRegistro":"proyectado","categoria":"transporte","subcategoria":"Trabajo","detalle":"Bus/Tren","monto":50.0,"fecha":"2027-01-23","persona":"Sanat","grupoId":"seedgrp_014"},{"id":"seed_0154","tipo":"gasto","tipoRegistro":"proyectado","categoria":"transporte","subcategoria":"Trabajo","detalle":"Bus/Tren","monto":50.0,"fecha":"2027-02-23","persona":"Sanat","grupoId":"seedgrp_014"},{"id":"seed_0155","tipo":"gasto","tipoRegistro":"real","categoria":"otros","subcategoria":"Comida","detalle":"Pizza","monto":41.0,"fecha":"2026-03-23","persona":"Sanat","grupoId":null},{"id":"seed_0156","tipo":"gasto","tipoRegistro":"real","categoria":"deuda","subcategoria":"Deuda a Giuli","detalle":"prestamo","monto":210.0,"fecha":"2026-03-23","persona":"Sanat","grupoId":null},{"id":"seed_0157","tipo":"gasto","tipoRegistro":"proyectado","categoria":"deuda","subcategoria":"Deuda a Giuli","detalle":"prestamo","monto":210.0,"fecha":"2026-03-23","persona":"Sanat","grupoId":null},{"id":"seed_0158","tipo":"gasto","tipoRegistro":"real","categoria":"transporte","subcategoria":"Varios","detalle":"Bus/Tren/Taxi","monto":12.5,"fecha":"2026-03-26","persona":"Sanat","grupoId":null},{"id":"seed_0159","tipo":"gasto","tipoRegistro":"proyectado","categoria":"salud","subcategoria":"Skincare","detalle":"","monto":50.0,"fecha":"2026-04-23","persona":"Sanat","grupoId":null},{"id":"seed_0160","tipo":"gasto","tipoRegistro":"real","categoria":"salud","subcategoria":"Peluqueria","detalle":"","monto":15.0,"fecha":"2026-03-26","persona":"Sanat","grupoId":null},{"id":"seed_0161","tipo":"gasto","tipoRegistro":"proyectado","categoria":"salud","subcategoria":"Peluqueria","detalle":"","monto":50.0,"fecha":"2026-03-23","persona":"Sanat","grupoId":null},{"id":"seed_0162","tipo":"gasto","tipoRegistro":"proyectado","categoria":"ahorro","subcategoria":"Ahorro / Emergencias","detalle":"","monto":0.0,"fecha":"2026-03-24","persona":"Sanat","grupoId":null},{"id":"seed_0163","tipo":"gasto","tipoRegistro":"proyectado","categoria":"aseo_personal","subcategoria":"Aseo Personal","detalle":"Desodorante, etc","monto":50.0,"fecha":"2026-03-28","persona":"Sanat","grupoId":null},{"id":"seed_0164","tipo":"gasto","tipoRegistro":"proyectado","categoria":"mascota","subcategoria":"Gata","detalle":"Flora","monto":50.0,"fecha":"2026-03-26","persona":"Sanat","grupoId":null},{"id":"seed_0165","tipo":"gasto","tipoRegistro":"proyectado","categoria":"cumpleanos","subcategoria":"Cumpleaños","detalle":"Regalos :)","monto":50.0,"fecha":"2026-03-25","persona":"Sanat","grupoId":null},{"id":"seed_0166","tipo":"gasto","tipoRegistro":"real","categoria":"fijos_vivienda","subcategoria":"Servicios","detalle":"Luz","monto":101.0,"fecha":"2026-04-08","persona":"Sanat","grupoId":null},{"id":"seed_0167","tipo":"gasto","tipoRegistro":"proyectado","categoria":"servicios_digitales","subcategoria":"Plan Móvil","detalle":"Entel","monto":40.0,"fecha":"2026-04-06","persona":"Sanat","grupoId":null},{"id":"seed_0168","tipo":"gasto","tipoRegistro":"real","categoria":"otros","subcategoria":"Salida Familiar","detalle":"","monto":100.0,"fecha":"2026-03-26","persona":"Sanat","grupoId":null},{"id":"seed_0169","tipo":"gasto","tipoRegistro":"proyectado","categoria":"inversion","subcategoria":"ChatGPT","detalle":"","monto":23.0,"fecha":"2026-03-30","persona":"Sanat","grupoId":null},{"id":"seed_0170","tipo":"gasto","tipoRegistro":"real","categoria":"aseo_personal","subcategoria":"Aseo Personal","detalle":"Desodorante, etc","monto":46.5,"fecha":"2026-04-04","persona":"Sanat","grupoId":null},{"id":"seed_0171","tipo":"gasto","tipoRegistro":"proyectado","categoria":"fijos_vivienda","subcategoria":"Alquiler","detalle":"Minidepa","monto":550.0,"fecha":"2026-03-27","persona":"Sanat","grupoId":null},{"id":"seed_0172","tipo":"gasto","tipoRegistro":"real","categoria":"fijos_vivienda","subcategoria":"Alquiler","detalle":"Minidepa","monto":550.0,"fecha":"2026-03-28","persona":"Sanat","grupoId":null},{"id":"seed_0173","tipo":"gasto","tipoRegistro":"real","categoria":"mascota","subcategoria":"Gata","detalle":"Flora","monto":40.0,"fecha":"2026-04-04","persona":"Sanat","grupoId":null},{"id":"seed_0174","tipo":"gasto","tipoRegistro":"proyectado","categoria":"servicios_digitales","subcategoria":"Spotify","detalle":"Música","monto":21.0,"fecha":"2026-03-20","persona":"Sanat","grupoId":null},{"id":"seed_0175","tipo":"gasto","tipoRegistro":"real","categoria":"otros","subcategoria":"Salida Familiar","detalle":"","monto":84.29,"fecha":"2026-04-04","persona":"Sanat","grupoId":null},{"id":"seed_0176","tipo":"gasto","tipoRegistro":"real","categoria":"inversion","subcategoria":"ChatGPT","detalle":"","monto":23.0,"fecha":"2026-04-04","persona":"Sanat","grupoId":null},{"id":"seed_0177","tipo":"gasto","tipoRegistro":"proyectado","categoria":"servicios_digitales","subcategoria":"Google One","detalle":"Almacenamiento","monto":13.0,"fecha":"2026-04-21","persona":"Sanat","grupoId":null},{"id":"seed_0178","tipo":"gasto","tipoRegistro":"real","categoria":"transporte","subcategoria":"Varios","detalle":"Bus/Tren/Taxi","monto":133.0,"fecha":"2026-04-04","persona":"Sanat","grupoId":null},{"id":"seed_0179","tipo":"gasto","tipoRegistro":"real","categoria":"transporte","subcategoria":"Varios","detalle":"Bus/Tren/Taxi","monto":26.5,"fecha":"2026-04-05","persona":"Sanat","grupoId":null},{"id":"seed_0180","tipo":"gasto","tipoRegistro":"real","categoria":"otros","subcategoria":"Varios","detalle":"","monto":126.0,"fecha":"2026-04-05","persona":"Sanat","grupoId":null},{"id":"seed_0181","tipo":"gasto","tipoRegistro":"proyectado","categoria":"fijos_vivienda","subcategoria":"Aseo de Casa","detalle":"","monto":50.0,"fecha":"2026-03-25","persona":"Sanat","grupoId":null},{"id":"seed_0182","tipo":"gasto","tipoRegistro":"real","categoria":"fijos_vivienda","subcategoria":"Aseo de Casa","detalle":"","monto":19.9,"fecha":"2026-04-04","persona":"Sanat","grupoId":null},{"id":"seed_0183","tipo":"gasto","tipoRegistro":"real","categoria":"fijos_vivienda","subcategoria":"Servicios","detalle":"Internet","monto":60.0,"fecha":"2026-04-08","persona":"Sanat","grupoId":null},{"id":"seed_0184","tipo":"gasto","tipoRegistro":"real","categoria":"servicios_digitales","subcategoria":"Plan Móvil","detalle":"Entel","monto":40.0,"fecha":"2026-04-12","persona":"Sanat","grupoId":null},{"id":"seed_0185","tipo":"gasto","tipoRegistro":"real","categoria":"transporte","subcategoria":"Varios","detalle":"Bus/Tren/Taxi","monto":66.5,"fecha":"2026-04-12","persona":"Sanat","grupoId":null},{"id":"seed_0186","tipo":"gasto","tipoRegistro":"proyectado","categoria":"inversion","subcategoria":"Claude","detalle":"","monto":74.8,"fecha":"2026-04-21","persona":"Sanat","grupoId":null},{"id":"seed_0187","tipo":"gasto","tipoRegistro":"real","categoria":"inversion","subcategoria":"Claude","detalle":"","monto":74.8,"fecha":"2026-04-21","persona":"Sanat","grupoId":null}];

// ============ ZONA HORARIA LIMA ============
let APP_TZ = 'America/Lima'; // Se actualiza cuando carga config

const nowLocal = () => {
  return new Date(new Date().toLocaleString('en-US', { timeZone: APP_TZ }));
};

const horaLocal = () => {
  const n = nowLocal();
  return String(n.getHours()).padStart(2,'0') + ':' + String(n.getMinutes()).padStart(2,'0');
};

const toISODate = (d) => {
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
};

// Fecha + hora Lima como "2026-04-30T20:08"
const toISOFechaHora = () => {
  const n = nowLocal();
  const yyyy = n.getFullYear();
  const mm = String(n.getMonth() + 1).padStart(2, '0');
  const dd = String(n.getDate()).padStart(2, '0');
  const hh = String(n.getHours()).padStart(2, '0');
  const mi = String(n.getMinutes()).padStart(2, '0');
  const ss = String(n.getSeconds()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}T${hh}:${mi}:${ss}`;
};

// Extraer solo la parte de fecha de un valor que puede ser "2026-04-30" o "2026-04-30T20:08"
const extraerFecha = (s) => s ? s.substring(0, 10) : '';

// Extraer solo la hora de "2026-04-30T20:08" -> "20:08", o '' si no tiene hora
const extraerHora = (s) => {
  if (!s || s.length <= 10) return '';
  const sep = s.indexOf('T') !== -1 ? s.indexOf('T') : s.indexOf(' ');
  if (sep === -1 || sep >= s.length - 1) return '';
  return s.substring(sep + 1, Math.min(sep + 6, s.length));
};
  
const parseFechaLima = (s) => {
  if (!s) return new Date();
  // Soporta "2026-04-30" y "2026-04-30T20:08"
  const datePart = s.substring(0, 10);
  const [y, m, d] = datePart.split('-').map(Number);
  if (s.length > 10 && (s.includes('T') || s.charAt(10) === ' ')) {
    const timePart = s.substring(11, 16);
    const [hh, mi] = timePart.split(':').map(Number);
    return new Date(y, m - 1, d, hh, mi, 0);
  }
  return new Date(y, m - 1, d, 12, 0, 0);
};

const formatMonto = (v, moneda = 'S/.') => {
  const n = Number(v) || 0;
  return `${moneda} ${n.toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

const ajustarSiFinDeSemana = (fecha) => {
  const d = new Date(fecha);
  const dow = d.getDay();
  if (dow === 6) d.setDate(d.getDate() - 1);
  if (dow === 0) d.setDate(d.getDate() - 2);
  return d;
};

const getRangoMesFinanciero = (fechaRef, diaInicio, ajustar) => {
  const ref = new Date(fechaRef);
  ref.setHours(12,0,0,0);
  let inicio = new Date(ref.getFullYear(), ref.getMonth(), diaInicio, 12);
  if (ajustar) inicio = ajustarSiFinDeSemana(inicio);
  if (ref < inicio) {
    inicio = new Date(ref.getFullYear(), ref.getMonth() - 1, diaInicio, 12);
    if (ajustar) inicio = ajustarSiFinDeSemana(inicio);
  }
  let fin = new Date(inicio.getFullYear(), inicio.getMonth() + 1, diaInicio, 12);
  if (ajustar) fin = ajustarSiFinDeSemana(fin);
  fin = new Date(fin.getTime() - 24*60*60*1000);
  return { inicio, fin };
};

const formatFecha = (d) => `${String(d.getDate()).padStart(2,'0')}/${String(d.getMonth()+1).padStart(2,'0')}/${d.getFullYear()}`;
const formatFechaCorta = (d) => `${String(d.getDate()).padStart(2,'0')}/${String(d.getMonth()+1).padStart(2,'0')}`;
const NOMBRES_MES_LARGO = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];

// ============ STORAGE LOCAL ============
const KEYS = {
  TX_CACHE: 'fin:tx', CONFIG: 'fin:cfg', CAT_G: 'fin:cg', CAT_I: 'fin:ci',
  SCRIPT_URL: 'fin:url', PENDING: 'fin:pending',
};
const loadL = (k, fb) => { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : fb; } catch { return fb; } };
const saveL = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} };

// ============ OFFLINE QUEUE ============
const getPending = () => loadL(KEYS.PENDING, []);
const addPending = (action) => { const q = getPending(); q.push(action); saveL(KEYS.PENDING, q); };
const clearPending = () => saveL(KEYS.PENDING, []);

// ============ API CLIENT ============
async function api(url, method, body) {
  if (!url) throw new Error('Sin URL de Apps Script');
  const opts = method === 'GET'
    ? { method: 'GET' }
    : { method: 'POST', headers: { 'Content-Type': 'text/plain;charset=utf-8' }, body: JSON.stringify(body) };
  const endpoint = method === 'GET' ? url + '?action=' + body.action : url;
  const res = await fetch(endpoint, opts);
  const data = await res.json();
  if (!data.ok) throw new Error(data.error || 'Error');
  return data;
}

const apiList = async (u) => {
  const r = await api(u, 'GET', { action: 'list' });
  return (r.data || []).map(tx => ({
    ...tx, monto: typeof tx.monto === 'string' ? parseFloat(tx.monto.replace(',','.')) || 0 : Number(tx.monto) || 0,
  }));
};
const apiSave = (u, tx) => api(u, 'POST', { action: 'save', tx });
const apiSaveMany = (u, txs) => api(u, 'POST', { action: 'saveMany', txs });
const apiDelete = (u, id) => api(u, 'POST', { action: 'delete', id });
const apiDeleteGroup = (u, gid, fromDate) => api(u, 'POST', { action: 'deleteGroup', grupoId: gid, fromDate });
const apiUpdate = (u, id, changes) => api(u, 'POST', { action: 'update', id, changes });
const apiReplaceAll = (u, txs) => api(u, 'POST', { action: 'replaceAll', txs });
const apiListCats = async (u) => { const r = await api(u, 'GET', { action: 'listCats' }); return r.data || []; };
const apiSaveCat = (u, cat) => api(u, 'POST', { action: 'saveCat', cat });
const apiDeleteCat = (u, id) => api(u, 'POST', { action: 'deleteCat', id });
const apiListSettings = async (u) => { const r = await api(u, 'GET', { action: 'listSettings' }); return r.data || {}; };
const apiSaveSetting = (u, key, value) => api(u, 'POST', { action: 'saveSetting', key, value });

// ============ ONLINE STATUS ============
function useOnline() {
  const [online, setOnline] = useState(navigator.onLine);
  useEffect(() => {
    const on = () => setOnline(true);
    const off = () => setOnline(false);
    window.addEventListener('online', on);
    window.addEventListener('offline', off);
    return () => { window.removeEventListener('online', on); window.removeEventListener('offline', off); };
  }, []);
  return online;
}

// ============ COMPONENTE PRINCIPAL ============
export default function App() {
  const [vista, setVista] = useState('agregar'); // agregar | dashboard | registro | analisis | config
  const [transacciones, setTransacciones] = useState([]);
  const [config, setConfig] = useState(DEFAULT_CONFIG);
  const [catGasto, setCatGasto] = useState(DEFAULT_CATEGORIAS_GASTO);
  const [catIngreso, setCatIngreso] = useState(DEFAULT_CATEGORIAS_INGRESO);
  const [loading, setLoading] = useState(true);
  const [fechaRef, setFechaRef] = useState(nowLocal());
  const [toast, setToast] = useState(null);
  const [scriptUrl, setScriptUrl] = useState('');
  const [syncStatus, setSyncStatus] = useState('idle');
  const [showFormCompleto, setShowFormCompleto] = useState(false);
  const [filtroGlobal, setFiltroGlobal] = useState(null);
  const [editTx, setEditTx] = useState(null);
  const online = useOnline();

  const showToast = (msg, tipo = 'success') => { setToast({ msg, tipo }); setTimeout(() => setToast(null), 2500); };

  // TEMA
  const sistemaOscuro = typeof window !== 'undefined' && window.matchMedia?.('(prefers-color-scheme: dark)').matches;
  const isDark = config.tema === 'auto' ? sistemaOscuro : config.tema === 'oscuro';
  const acento = ACENTOS[config.acento || 'amber'];

  const D = {
    bg: isDark ? 'bg-stone-950' : 'bg-stone-50',
    bgCard: isDark ? 'bg-stone-900' : 'bg-white',
    bgMuted: isDark ? 'bg-stone-800' : 'bg-stone-100',
    bgInput: isDark ? 'bg-stone-800' : 'bg-white',
    bgHero: isDark ? 'from-stone-950 via-stone-900 to-stone-950' : 'from-stone-900 via-stone-800 to-stone-900',
    border: isDark ? 'border-stone-700' : 'border-stone-200',
    borderMuted: isDark ? 'border-stone-700' : 'border-stone-300',
    text: isDark ? 'text-stone-100' : 'text-stone-900',
    textMuted: isDark ? 'text-stone-400' : 'text-stone-500',
    textSub: isDark ? 'text-stone-300' : 'text-stone-700',
    glass: isDark ? 'bg-stone-950/80 backdrop-blur-md' : 'bg-white/80 backdrop-blur-md',
    accentText: acento.text,
    accentDot: acento.dot,
  };

  // ======== CARGAR DATOS ========
  useEffect(() => {
    // 1. Cargar cache local INMEDIATAMENTE — la app se ve al instante
    const cfg = loadL(KEYS.CONFIG, DEFAULT_CONFIG);
    const cg = loadL(KEYS.CAT_G, DEFAULT_CATEGORIAS_GASTO);
    const ci = loadL(KEYS.CAT_I, DEFAULT_CATEGORIAS_INGRESO);
    const url = loadL(KEYS.SCRIPT_URL, '');
    const cache = loadL(KEYS.TX_CACHE, []);
    APP_TZ = getTZ(cfg.pais || 'PE');
    setConfig(cfg); setCatGasto(cg); setCatIngreso(ci); setScriptUrl(url); setTransacciones(cache);
    setLoading(false); // ← la UI ya es usable, no esperamos al servidor

    // 2. Sincronizar con el servidor EN SEGUNDO PLANO
    if (url && navigator.onLine) {
      (async () => {
        try {
          setSyncStatus('syncing');
          const pending = getPending();
          for (const action of pending) {
            try {
              if (action.type === 'save') await apiSave(url, action.tx);
              else if (action.type === 'saveMany') await apiSaveMany(url, action.txs);
              else if (action.type === 'delete') await apiDelete(url, action.id);
              else if (action.type === 'update') await apiUpdate(url, action.id, action.changes);
            } catch {}
          }
          if (pending.length > 0) clearPending();

          const [remoteTxs, remoteCats] = await Promise.all([
            apiList(url), apiListCats(url).catch(() => null),
          ]);
          setTransacciones(remoteTxs); saveL(KEYS.TX_CACHE, remoteTxs);
          if (remoteCats) {
            const g = remoteCats.filter(c => c.tipo === 'gasto').sort((a,b) => (a.orden||99)-(b.orden||99));
            const i = remoteCats.filter(c => c.tipo === 'ingreso').sort((a,b) => (a.orden||99)-(b.orden||99));
            setCatGasto(g); saveL(KEYS.CAT_G, g);
            setCatIngreso(i); saveL(KEYS.CAT_I, i);
          }
          try {
            const settings = await apiListSettings(url);
            if (settings.pais) {
              const paisData = PAISES_LATAM.find(p => p.code === settings.pais);
              if (paisData) {
                cfg.pais = paisData.code;
                cfg.moneda = paisData.moneda;
                APP_TZ = paisData.tz;
                setConfig({...cfg});
                saveL(KEYS.CONFIG, cfg);
              }
            }
          } catch {}
          setSyncStatus('idle');
        } catch { setSyncStatus('error'); }
      })();
    }
  }, []);

  // ======== SYNC ========
  const sincronizar = useCallback(async () => {
    if (!scriptUrl || !online) return;
    try {
      setSyncStatus('syncing');
      const pending = getPending();
      for (const a of pending) {
        try {
          if (a.type === 'save') await apiSave(scriptUrl, a.tx);
          else if (a.type === 'saveMany') await apiSaveMany(scriptUrl, a.txs);
          else if (a.type === 'delete') await apiDelete(scriptUrl, a.id);
          else if (a.type === 'update') await apiUpdate(scriptUrl, a.id, a.changes);
        } catch {}
      }
      if (pending.length > 0) clearPending();
      const [remoteTxs, remoteCats] = await Promise.all([apiList(scriptUrl), apiListCats(scriptUrl).catch(() => null)]);
      setTransacciones(remoteTxs); saveL(KEYS.TX_CACHE, remoteTxs);
      if (remoteCats) {
        const g = remoteCats.filter(c => c.tipo === 'gasto').sort((a,b) => (a.orden||99)-(b.orden||99));
        const i = remoteCats.filter(c => c.tipo === 'ingreso').sort((a,b) => (a.orden||99)-(b.orden||99));
        setCatGasto(g); saveL(KEYS.CAT_G, g);
        setCatIngreso(i); saveL(KEYS.CAT_I, i);
      }
      setSyncStatus('idle'); showToast('Sincronizado ✓');
    } catch { setSyncStatus('error'); showToast('Error al sincronizar', 'error'); }
  }, [scriptUrl, online]);

  // ======== ACCIONES (con soporte offline) ========
  const updateLocal = (newTxs) => { setTransacciones(newTxs); saveL(KEYS.TX_CACHE, newTxs); };

  const guardarTx = async (tx) => {
    if (tx.id) {
      const updated = { ...tx, monto: parseFloat(tx.monto) || 0 };
      updateLocal(transacciones.map(t => t.id === tx.id ? updated : t));
      setShowFormCompleto(false); setEditTx(null); showToast('Actualizado ✓');
      if (scriptUrl && online) { try { setSyncStatus('syncing'); await apiSave(scriptUrl, updated); setSyncStatus('idle'); } catch { setSyncStatus('error'); addPending({ type: 'save', tx: updated }); } }
      else if (scriptUrl) addPending({ type: 'save', tx: updated });
    } else {
      const baseId = `tx_${Date.now()}_${Math.random().toString(36).slice(2,7)}`;
      const veces = Math.max(1, Math.min(12, parseInt(tx.veces) || 1));
      const fechaBase = new Date(tx.fecha);
      const grupoId = veces > 1 ? `grp_${Date.now()}` : null;
      const nuevas = [];
      for (let i = 0; i < veces; i++) {
        const f = new Date(fechaBase); f.setMonth(f.getMonth() + i);
        // Solo el primer registro (hoy) lleva hora; los futuros solo fecha
        const fechaStr = i === 0 && tx.tipoRegistro === 'real' ? toISOFechaHora() : toISODate(f);
        nuevas.push({ tipo: tx.tipo, tipoRegistro: tx.tipoRegistro, categoria: tx.categoria,
          subcategoria: tx.subcategoria || '', detalle: tx.detalle || '', persona: tx.persona || config.persona,
          id: i === 0 ? baseId : `${baseId}_${i}`, fecha: fechaStr,
          grupoId, monto: parseFloat(tx.monto) || 0 });
      }
      updateLocal([...transacciones, ...nuevas]);
      setShowFormCompleto(false); setEditTx(null);
      showToast(veces > 1 ? `${veces} registros ✓` : 'Registrado ✓');
      if (scriptUrl && online) {
        try { setSyncStatus('syncing'); if (nuevas.length === 1) await apiSave(scriptUrl, nuevas[0]); else await apiSaveMany(scriptUrl, nuevas); setSyncStatus('idle'); }
        catch { setSyncStatus('error'); addPending(nuevas.length === 1 ? { type: 'save', tx: nuevas[0] } : { type: 'saveMany', txs: nuevas }); }
      } else if (scriptUrl) addPending(nuevas.length === 1 ? { type: 'save', tx: nuevas[0] } : { type: 'saveMany', txs: nuevas });
    }
  };

  const eliminarTx = async (id, soloEste = true) => {
    const tx = transacciones.find(t => t.id === id);
    if (!tx) return;
    let nuevas;
    if (!soloEste && tx.grupoId) {
      nuevas = transacciones.filter(t => { if (t.grupoId !== tx.grupoId) return true; return new Date(t.fecha) < new Date(tx.fecha); });
    } else { nuevas = transacciones.filter(t => t.id !== id); }
    updateLocal(nuevas); showToast('Eliminado');
    if (scriptUrl && online) {
      try { setSyncStatus('syncing'); if (!soloEste && tx.grupoId) await apiDeleteGroup(scriptUrl, tx.grupoId, tx.fecha); else await apiDelete(scriptUrl, id); setSyncStatus('idle'); }
      catch { setSyncStatus('error'); addPending({ type: 'delete', id }); }
    } else if (scriptUrl) addPending({ type: 'delete', id });
  };

  const marcarComoReal = async (id) => {
    updateLocal(transacciones.map(t => t.id === id ? { ...t, tipoRegistro: 'real' } : t));
    showToast('Marcado como real ✓');
    if (scriptUrl && online) { try { await apiUpdate(scriptUrl, id, { tipoRegistro: 'real' }); } catch { addPending({ type: 'update', id, changes: { tipoRegistro: 'real' } }); } }
    else if (scriptUrl) addPending({ type: 'update', id, changes: { tipoRegistro: 'real' } });
  };

  const exportarCSV = () => {
    const h = ['fecha','tipo','tipoRegistro','categoria','subcategoria','detalle','monto','persona'];
    const rows = transacciones.map(t => h.map(k => `"${String(t[k]||'').replace(/"/g,'""')}"`).join(','));
    const csv = [h.join(','), ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob);
    a.download = `finanzas_${toISODate(nowLocal())}.csv`; a.click(); showToast('CSV descargado');
  };

  const guardarCat = async (cat, tipo) => {
    const c = { ...cat, tipo };
    if (tipo === 'gasto') { const n = catGasto.find(x => x.id === cat.id) ? catGasto.map(x => x.id === cat.id ? c : x) : [...catGasto, c]; setCatGasto(n); saveL(KEYS.CAT_G, n); }
    else { const n = catIngreso.find(x => x.id === cat.id) ? catIngreso.map(x => x.id === cat.id ? c : x) : [...catIngreso, c]; setCatIngreso(n); saveL(KEYS.CAT_I, n); }
    if (scriptUrl && online) { try { await apiSaveCat(scriptUrl, c); } catch {} }
    showToast('Categoría guardada ✓');
  };

  const eliminarCat = async (id, tipo) => {
    if (tipo === 'gasto') { const n = catGasto.filter(c => c.id !== id); setCatGasto(n); saveL(KEYS.CAT_G, n); }
    else { const n = catIngreso.filter(c => c.id !== id); setCatIngreso(n); saveL(KEYS.CAT_I, n); }
    if (scriptUrl && online) { try { await apiDeleteCat(scriptUrl, id); } catch {} }
  };

  const navegarMes = (d) => { const n = new Date(fechaRef); n.setMonth(n.getMonth() + d); setFechaRef(n); };

  // ======== DATOS COMPUTADOS ========
  const mesActual = useMemo(() => getRangoMesFinanciero(fechaRef, config.diaInicioMes, config.ajustarFinDeSemana), [fechaRef, config]);
  const txDelMes = useMemo(() => transacciones.filter(t => {
    if (!t.fecha) return false;
    const f = parseFechaLima(extraerFecha(t.fecha));
    return f >= mesActual.inicio && f <= mesActual.fin;
  }), [transacciones, mesActual]);
  const stats = useMemo(() => {
    const ip = txDelMes.filter(t => t.tipo === 'ingreso' && t.tipoRegistro === 'proyectado').reduce((s,t) => s + Number(t.monto), 0);
    const ir = txDelMes.filter(t => t.tipo === 'ingreso' && t.tipoRegistro === 'real').reduce((s,t) => s + Number(t.monto), 0);
    const gp = txDelMes.filter(t => t.tipo === 'gasto' && t.tipoRegistro === 'proyectado').reduce((s,t) => s + Number(t.monto), 0);
    const gr = txDelMes.filter(t => t.tipo === 'gasto' && t.tipoRegistro === 'real').reduce((s,t) => s + Number(t.monto), 0);
    return { ingresoProy: ip, ingresoReal: ir, gastoProy: gp, gastoReal: gr, balanceProy: ip-gp, balanceReal: ir-gr, ejecucion: gp > 0 ? (gr/gp)*100 : 0 };
  }, [txDelMes]);

  // Pending count para badge offline
  const pendingCount = getPending().length;

  if (loading) return <div className={`min-h-screen flex items-center justify-center ${isDark ? 'bg-stone-950' : 'bg-stone-50'}`}><div className={`font-serif text-xl italic ${isDark ? 'text-stone-300' : 'text-stone-600'}`}>Cargando...</div></div>;

  return (
    <div className={`min-h-screen ${D.bg} pb-20 transition-colors duration-300`} style={{ fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600;9..144,700;9..144,800;9..144,900&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap');
        .font-serif { font-family: 'Fraunces', Georgia, serif; }
        .grain { background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.04 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E"); }
        @keyframes slide-up { from { transform: translateY(100%); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        @keyframes fade-in { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        .animate-slide-up { animation: slide-up 0.3s cubic-bezier(0.16, 1, 0.3, 1); }
        .animate-fade-in { animation: fade-in 0.4s ease-out; }
      `}</style>

      {/* ===== OFFLINE BANNER ===== */}
      {!online && (
        <div className="sticky top-0 z-50 bg-amber-500 text-white text-center py-2 text-xs font-semibold flex items-center justify-center gap-1.5">
          <WifiOff className="w-3.5 h-3.5" /> Sin conexión — los registros se guardarán cuando vuelvas
          {pendingCount > 0 && <span className="bg-white/30 px-1.5 rounded-full">{pendingCount}</span>}
        </div>
      )}

      {/* ===== CONTENIDO ===== */}
      <main className="max-w-2xl mx-auto px-4 pt-3 pb-2">
        {vista === 'agregar' && (
          <VistaAgregar
            catGasto={catGasto} catIngreso={catIngreso} config={config} transacciones={transacciones}
            onGuardar={guardarTx} D={D} online={online}
            onFormCompleto={() => { setEditTx(null); setShowFormCompleto(true); }}
          />
        )}
        {vista === 'dashboard' && (
          online || transacciones.length > 0 ? (
            <Dashboard stats={stats} txDelMes={txDelMes} catGasto={catGasto} catIngreso={catIngreso}
              config={config} D={D} mesActual={mesActual} onNavMes={navegarMes}
              onMarcarReal={marcarComoReal} onEditar={(tx) => { setEditTx(tx); setShowFormCompleto(true); }}
              onEliminar={eliminarTx} syncStatus={syncStatus} onSync={sincronizar} scriptUrl={scriptUrl}
              online={online}
              onVerIngresos={() => { setVista('registro'); setFiltroGlobal('ingreso'); }}
              onVerGastos={() => { setVista('registro'); setFiltroGlobal('real'); }}
              onVerAnalisis={() => setVista('analisis')} />
          ) : <OfflineMsg D={D} />
        )}
        {vista === 'registro' && (
          online || transacciones.length > 0 ? (
            <Registro transacciones={txDelMes} catGasto={catGasto} catIngreso={catIngreso} config={config} D={D}
              mesActual={mesActual} onNavMes={navegarMes}
              onMarcarReal={marcarComoReal} onEditar={(tx) => { setEditTx(tx); setShowFormCompleto(true); }}
              onEliminar={eliminarTx}
              filtroInicial={filtroGlobal}
              onFiltroUsado={() => setFiltroGlobal(null)} />
          ) : <OfflineMsg D={D} />
        )}
        {vista === 'analisis' && (
          online || transacciones.length > 0 ? (
            <Analisis transacciones={transacciones} catGasto={catGasto} catIngreso={catIngreso} config={config} D={D} />
          ) : <OfflineMsg D={D} />
        )}
        {vista === 'config' && (
          <Config config={config} setConfig={(c) => { setConfig(c); saveL(KEYS.CONFIG, c); }}
            catGasto={catGasto} catIngreso={catIngreso} onGuardarCat={guardarCat} onEliminarCat={eliminarCat}
            paises={PAISES_LATAM}
            sugerGasto={CATEGORIAS_SUGERIDAS_GASTO} sugerIngreso={CATEGORIAS_SUGERIDAS_INGRESO}
            onExport={exportarCSV} totalTx={transacciones.length} scriptUrl={scriptUrl}
            setScriptUrl={(u) => { setScriptUrl(u); saveL(KEYS.SCRIPT_URL, u); }}
            transacciones={transacciones} onSincronizar={sincronizar} syncStatus={syncStatus} D={D} isDark={isDark}
            online={online} />
        )}
      </main>

      {/* ===== BOTTOM NAV (5 tabs, + al centro) ===== */}
      <nav className={`fixed bottom-0 left-0 right-0 z-30 border-t ${D.glass} ${D.border}`} style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}>
        <div className="max-w-2xl mx-auto px-1 py-1 grid grid-cols-5 items-end">
          {[
            { id: 'dashboard', icon: Wallet, label: 'Resumen' },
            { id: 'registro', icon: BarChart3, label: 'Registros' },
            { id: 'agregar', icon: null, label: '' },
            { id: 'analisis', icon: PieChart, label: 'Análisis' },
            { id: 'config', icon: Settings, label: 'Ajustes' },
          ].map(item => item.id === 'agregar' ? (
            <div key="agregar" className="flex justify-center -mt-5">
              <button
                onClick={() => setVista('agregar')}
                className="w-14 h-14 rounded-full flex items-center justify-center shadow-xl transition-all active:scale-95"
                style={{ backgroundColor: vista === 'agregar' ? acento.dot : '#1c1917', boxShadow: '0 8px 25px -4px rgba(0,0,0,0.4)' }}
              >
                <Plus className="w-7 h-7 text-white" />
              </button>
            </div>
          ) : (
            <button key={item.id} onClick={() => setVista(item.id)}
              className={`flex flex-col items-center gap-0.5 py-2 rounded-xl transition ${vista === item.id ? D.accentText : D.textMuted}`}>
              <item.icon className="w-5 h-5" strokeWidth={vista === item.id ? 2.5 : 1.75} />
              <span className={`text-[9px] uppercase tracking-wider ${vista === item.id ? 'font-bold' : ''}`}>{item.label}</span>
            </button>
          ))}
        </div>
      </nav>

      {/* ===== FORM COMPLETO MODAL ===== */}
      {showFormCompleto && (
        <FormularioTx tx={editTx} catGasto={catGasto} catIngreso={catIngreso} config={config}
          transacciones={transacciones} onGuardar={guardarTx} onEliminar={eliminarTx}
          onCerrar={() => { setShowFormCompleto(false); setEditTx(null); }} D={D} />
      )}

      {/* ===== TOAST ===== */}
      {toast && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 animate-fade-in">
          <div className={`px-5 py-2.5 rounded-full shadow-lg text-sm font-medium ${toast.tipo === 'success' ? 'bg-stone-900 text-white' : 'bg-red-500 text-white'}`}>
            {toast.msg}
          </div>
        </div>
      )}
    </div>
  );
}

// ============ OFFLINE MESSAGE ============
function OfflineMsg({ D }) {
  return (
    <div className={`rounded-2xl border-2 border-dashed p-10 text-center mt-8 ${D.borderMuted} ${D.bgCard}`}>
      <WifiOff className={`w-10 h-10 mx-auto mb-3 ${D.textMuted}`} />
      <p className={`font-serif text-lg font-semibold ${D.text}`}>Sin conexión</p>
      <p className={`text-sm mt-1 ${D.textMuted}`}>Conecta a internet para ver esta sección.<br />Mientras tanto puedes registrar gastos en el tab +</p>
    </div>
  );
}

// ============ VISTA AGREGAR (REGISTRO RÁPIDO) ============
function VistaAgregar({ catGasto, catIngreso, config, transacciones, onGuardar, D, online, onFormCompleto }) {
  const [monto, setMonto] = useState('');
  const [tipo, setTipo] = useState('gasto');
  const [tipoRegistro, setTipoRegistro] = useState('real');
  const [categoria, setCategoria] = useState('');
  const [detalle, setDetalle] = useState('');
  const touchRef = useRef(null);

  const handleTouchStart = (e) => { touchRef.current = e.touches[0].clientX; };
  const handleTouchEnd = (e) => {
    if (touchRef.current === null) return;
    const diff = e.changedTouches[0].clientX - touchRef.current;
    if (diff > 80) onFormCompleto();
    touchRef.current = null;
  };

  const cats = tipo === 'gasto' ? catGasto : catIngreso;
  const topCats = useMemo(() => {
    const counts = {};
    (transacciones || []).filter(t => t.tipo === tipo).forEach(t => { counts[t.categoria] = (counts[t.categoria] || 0) + 1; });
    const sorted = Object.entries(counts).sort((a,b) => b[1]-a[1]).map(([id]) => id);
    const top = sorted.slice(0, 6);
    if (top.length < 6) cats.forEach(c => { if (!top.includes(c.id) && top.length < 6) top.push(c.id); });
    return top.map(id => cats.find(c => c.id === id)).filter(Boolean);
  }, [transacciones, tipo, cats]);

  const guardar = () => {
    const m = parseFloat(monto.replace(',', '.'));
    if (!m || !categoria) { if (!m) return; if (!categoria) { /* auto-seleccionar primera */ return; } }
    const fechaStr = tipoRegistro === 'real' ? toISOFechaHora() : toISODate(nowLocal());
    onGuardar({ tipo, tipoRegistro, categoria, subcategoria: '', detalle, monto: m, fecha: fechaStr, persona: config.persona, veces: 1 });
    setMonto(''); setCategoria(''); setDetalle('');
  };

  const cat = cats.find(c => c.id === categoria);

  return (
    <div className="animate-fade-in" onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
      {/* Tabs Rápido / Completo — deslizables y visibles */}
      <div className={`grid grid-cols-2 gap-1 p-1 rounded-xl mb-4 ${D.bgMuted}`}>
        <button className={`py-2.5 rounded-lg text-sm font-semibold ${D.bgCard} shadow-sm ${D.text}`}>
          ⚡ Rápido
        </button>
        <button onClick={onFormCompleto} className={`py-2.5 rounded-lg text-sm font-medium ${D.textMuted}`}>
          Completo →
        </button>
      </div>

      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className={`font-serif text-2xl font-semibold ${D.text}`}>Registrar<span style={{ color: ACENTOS[config.acento || 'amber'].dot }}>.</span></h1>
          <p className={`text-[11px] ${D.textMuted}`}>
            {!online && <><WifiOff className="w-3 h-3 inline mr-1" />Offline · </>}
            {formatFecha(nowLocal())} · {horaLocal()}
          </p>
        </div>
      </div>

      {/* Toggle Gasto/Ingreso */}
      <div className={`grid grid-cols-2 gap-1 p-1 rounded-xl mb-5 ${D.bgMuted}`}>
        {['gasto', 'ingreso'].map(t => (
          <button key={t} onClick={() => { setTipo(t); setCategoria(''); }}
            className={`py-2 rounded-lg text-sm font-medium transition capitalize ${tipo === t ? D.bgCard + ' shadow-sm ' + D.text : D.textMuted}`}>
            {t === 'gasto' ? '💸 Gasto' : '💰 Ingreso'}
          </button>
        ))}
      </div>

      {/* MONTO */}
      <div className="text-center mb-5">
        <div className="flex items-baseline justify-center gap-1.5">
          <span className={`font-serif text-2xl ${D.textMuted}`}>{config.moneda}</span>
          <span className={`font-serif text-6xl font-bold tracking-tight ${monto ? D.text : D.textMuted}`}>{monto || '0'}</span>
        </div>
        {/* Real/Presupuesto */}
        <div className={`flex gap-2 justify-center mt-3 ${D.textMuted}`}>
          {['real','proyectado'].map(t => (
            <button key={t} onClick={() => setTipoRegistro(t)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition ${tipoRegistro === t ? 'bg-stone-900 text-white' : D.bgCard + ' border ' + D.border + ' ' + D.textSub}`}>
              {t === 'real' ? '⚡ Real' : '📅 Presup.'}
            </button>
          ))}
        </div>
      </div>

      {/* TECLADO NUMÉRICO */}
      <div className="grid grid-cols-3 gap-1.5 mb-4">
        {['1','2','3','4','5','6','7','8','9','.','0','⌫'].map(k => (
          <button key={k} onClick={() => {
              if (k === '⌫') setMonto(m => m.slice(0, -1));
              else if (k === '.' && monto.includes('.')) return;
              else setMonto(m => m + k);
            }}
            className={`h-12 rounded-xl font-serif text-xl font-medium transition active:scale-95 ${k === '⌫' ? D.bgMuted + ' ' + D.textMuted : D.bgCard + ' border ' + D.border + ' ' + D.text}`}>
            {k}
          </button>
        ))}
      </div>

      {/* CATEGORÍAS TOP 6 */}
      <div className="mb-3">
        <p className={`text-[10px] uppercase tracking-widest mb-2 ${D.textMuted}`}>Categoría</p>
        <div className="grid grid-cols-6 gap-1.5">
          {topCats.map(c => (
            <button key={c.id} onClick={() => setCategoria(c.id)}
              className={`p-1.5 rounded-xl border-2 flex flex-col items-center gap-0.5 transition active:scale-95 ${D.bgCard} ${categoria === c.id ? '' : D.border}`}
              style={{ borderColor: categoria === c.id ? c.color : undefined }}>
              <span className="text-xl">{c.emoji}</span>
              <span className={`text-[8px] leading-tight text-center font-medium ${D.textSub}`}>{c.nombre.split(' ')[0]}</span>
            </button>
          ))}
        </div>
      </div>

      {/* DETALLE */}
      <input type="text" value={detalle} onChange={e => setDetalle(e.target.value)}
        placeholder="Detalle rápido (opcional)"
        className={`w-full px-3 py-2 rounded-xl text-sm border outline-none mb-3 ${D.bgInput} ${D.border} ${D.text}`} />

      {/* GUARDAR */}
      <button onClick={guardar}
        disabled={!monto || parseFloat(monto.replace(',','.')) <= 0 || !categoria}
        className="w-full py-3.5 bg-stone-900 text-white font-semibold rounded-xl text-base transition disabled:opacity-30 active:scale-[0.98] shadow-lg">
        {cat ? `${cat.emoji} Guardar ${tipo}` : 'Selecciona categoría'}
      </button>

      {!online && (
        <p className={`text-center text-[11px] mt-2 ${D.textMuted}`}>
          Se guardará localmente y se sincronizará al conectarte
        </p>
      )}
    </div>
  );
}

// ============ DASHBOARD ============
function Dashboard({ stats, txDelMes, catGasto, catIngreso, config, D, mesActual, onNavMes, onMarcarReal, onEditar, onEliminar, syncStatus, onSync, scriptUrl, online, onVerIngresos, onVerGastos, onVerAnalisis }) {
  const [hidden, setHidden] = useState(true);
  const M = (v, mon) => hidden ? `${mon} ••••` : formatMonto(v, mon);

  const findCat = (tipo, id) => {
    const cats = tipo === 'gasto' ? catGasto : catIngreso;
    return cats.find(c => c.id === id) || { emoji: '📦', nombre: (id||'Otros').replace(/_/g,' '), color: '#8D99AE' };
  };

  // Últimos movimientos REALES ordenados por fecha+hora desc
  const ultimos = useMemo(() => {
    return [...txDelMes]
      .filter(t => t.tipoRegistro === 'real')
      .sort((a, b) => (b.fecha || '').localeCompare(a.fecha || ''))
      .slice(0, 5);
  }, [txDelMes]);

  return (
    <div className="space-y-4 animate-fade-in">
      {/* Header con sync */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className={`font-serif text-2xl font-semibold ${D.text}`}>Finanzas<span style={{ color: ACENTOS[config.acento||'amber'].dot }}>.</span></h1>
          <p className={`text-[11px] uppercase tracking-widest ${D.textMuted} flex items-center gap-1.5`}>
            <span className={`w-1.5 h-1.5 rounded-full ${!scriptUrl ? 'bg-stone-400' : syncStatus === 'error' ? 'bg-red-500' : syncStatus === 'syncing' ? 'bg-amber-500 animate-pulse' : 'bg-emerald-500'}`} />
            {config.persona}
          </p>
        </div>
        {scriptUrl && online && (
          <button onClick={onSync} disabled={syncStatus === 'syncing'}
            className={`p-2 rounded-full transition ${D.textMuted}`}>
            <RefreshCw className={`w-5 h-5 ${syncStatus === 'syncing' ? 'animate-spin' : ''}`} />
          </button>
        )}
      </div>

      {/* Nav mes */}
      <div className={`flex items-center justify-between rounded-2xl border p-2.5 ${D.bgCard} ${D.border}`}>
        <button onClick={() => onNavMes(-1)} className="p-1.5"><ChevronLeft className={`w-5 h-5 ${D.text}`} /></button>
        <div className="text-center">
          <div className={`font-serif text-base font-semibold ${D.text}`}>{formatFechaCorta(mesActual.inicio)} – {formatFechaCorta(mesActual.fin)}</div>
          <div className={`text-[10px] uppercase tracking-widest ${D.textMuted}`}>{NOMBRES_MES_LARGO[mesActual.inicio.getMonth()]} {mesActual.inicio.getFullYear()}</div>
        </div>
        <button onClick={() => onNavMes(1)} className="p-1.5"><ChevronRight className={`w-5 h-5 ${D.text}`} /></button>
      </div>

      {/* Hero Balance */}
      <div className={`relative overflow-hidden rounded-3xl bg-gradient-to-br ${D.bgHero} text-white p-5`}>
        <div className="absolute inset-0 grain opacity-30" />
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-amber-500/20 rounded-full blur-3xl" />
        <div className="relative">
          <div className="flex items-center justify-between">
            <p className="text-[10px] uppercase tracking-[0.2em] text-stone-400">Balance del período</p>
            <button onClick={() => setHidden(h => !h)} className="p-1.5 rounded-full hover:bg-white/10 transition">
              {hidden
                ? <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-stone-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M3 3l18 18" /></svg>
                : <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-stone-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
              }
            </button>
          </div>
          <div className={`mt-2 font-serif font-semibold tracking-tight ${hidden ? 'text-3xl' : 'text-4xl'}`}>{M(stats.balanceReal, config.moneda)}</div>
          <div className="mt-3 flex items-center gap-3 text-sm">
            <div><span className="text-stone-400 text-xs">Presup.</span><div className="font-medium">{M(stats.balanceProy, config.moneda)}</div></div>
            <div className="h-7 w-px bg-stone-700" />
            <div><span className="text-stone-400 text-xs">Diff</span>
              <div className={`font-medium ${hidden ? '' : (stats.balanceReal-stats.balanceProy >= 0 ? 'text-emerald-400' : 'text-amber-400')}`}>
                {hidden ? `${config.moneda} ••••` : `${stats.balanceReal-stats.balanceProy >= 0 ? '+' : ''}${formatMonto(stats.balanceReal-stats.balanceProy, config.moneda)}`}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Cards Ingreso/Gasto */}
      <div className="grid grid-cols-2 gap-2.5">
        {[{ l: 'Ingresos', r: stats.ingresoReal, p: stats.ingresoProy, icon: TrendingUp, color: 'emerald', action: onVerIngresos },
          { l: 'Gastos', r: stats.gastoReal, p: stats.gastoProy, icon: TrendingDown, color: 'red', action: onVerGastos }].map(c => (
          <div key={c.l} onClick={c.action} className={`rounded-2xl border p-3.5 cursor-pointer active:scale-[0.98] transition ${D.bgCard} ${D.border}`}>
            <div className="flex items-center gap-2 mb-2">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center bg-${c.color}-100 text-${c.color}-700`}><c.icon className="w-3.5 h-3.5" /></div>
              <span className={`text-[10px] uppercase tracking-widest font-medium ${D.textMuted}`}>{c.l}</span>
            </div>
            <div className={`font-serif text-xl font-semibold ${D.text}`}>{hidden ? `${config.moneda} ••••` : formatMonto(c.r, config.moneda)}</div>
            <div className={`mt-1 text-[11px] ${D.textMuted}`}>de {hidden ? `${config.moneda} ••••` : formatMonto(c.p, config.moneda)}</div>
          </div>
        ))}
      </div>

      {/* Ejecución */}
      <div onClick={onVerAnalisis} className={`rounded-2xl border p-4 cursor-pointer active:scale-[0.98] transition ${D.bgCard} ${D.border}`}>
        <div className="flex items-center justify-between mb-2">
          <p className={`text-[10px] uppercase tracking-widest ${D.textMuted}`}>Ejecución</p>
          <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${stats.ejecucion <= 80 ? 'bg-emerald-50 text-emerald-700' : stats.ejecucion <= 100 ? 'bg-amber-50 text-amber-700' : 'bg-red-50 text-red-700'}`}>
            {stats.ejecucion.toFixed(0)}%
          </span>
        </div>
        <div className={`h-2 rounded-full overflow-hidden ${D.bgMuted}`}>
          <div className={`h-full transition-all duration-700 ${stats.ejecucion <= 80 ? 'bg-emerald-500' : stats.ejecucion <= 100 ? 'bg-amber-500' : 'bg-red-500'}`}
            style={{ width: `${Math.min(stats.ejecucion, 100)}%` }} />
        </div>
      </div>

      {/* ===== ESTADO DEL PRESUPUESTO — ritmo del mes ===== */}
      {(() => {
        const hoy = nowLocal();
        const totalDias = Math.round((mesActual.fin - mesActual.inicio) / 86400000) + 1;
        const diasTranscurridos = Math.max(0, Math.min(totalDias, Math.round((hoy - mesActual.inicio) / 86400000) + 1));
        const pctTiempo = (diasTranscurridos / totalDias) * 100;
        const pctGasto = stats.gastoProy > 0 ? (stats.gastoReal / stats.gastoProy) * 100 : 0;
        const enRitmo = pctGasto <= pctTiempo + 5;
        const esMesActivo = hoy >= mesActual.inicio && hoy <= mesActual.fin;

        // Alertas por categoría: gastando más rápido que el ritmo del mes
        const catMap = {};
        txDelMes.filter(t => t.tipo === 'gasto').forEach(t => {
          if (!catMap[t.categoria]) catMap[t.categoria] = { proy: 0, real: 0 };
          if (t.tipoRegistro === 'proyectado') catMap[t.categoria].proy += Number(t.monto);
          else catMap[t.categoria].real += Number(t.monto);
        });
        const alertas = Object.entries(catMap)
          .map(([id, v]) => {
            const cat = findCat('gasto', id);
            const pct = v.proy > 0 ? (v.real / v.proy) * 100 : (v.real > 0 ? 999 : 0);
            return { id, nombre: cat.nombre, emoji: cat.emoji, color: cat.color, pct, real: v.real, proy: v.proy };
          })
          .filter(c => c.proy > 0 && c.pct > pctTiempo + 10)
          .sort((a, b) => b.pct - a.pct)
          .slice(0, 3);

        return (
          <div className={`rounded-2xl border p-4 ${D.bgCard} ${D.border}`}>
            <p className={`text-[10px] uppercase tracking-widest mb-3 ${D.textMuted}`}>Estado del presupuesto</p>

            {/* Doble barra: tiempo vs gasto */}
            <div className="space-y-2 mb-3">
              <div>
                <div className="flex justify-between mb-1">
                  <span className={`text-[11px] ${D.textSub}`}>Mes transcurrido</span>
                  <span className={`text-[11px] font-bold ${D.text}`}>{pctTiempo.toFixed(0)}%</span>
                </div>
                <div className={`h-2 rounded-full overflow-hidden ${D.bgMuted}`}>
                  <div className="h-full bg-stone-400" style={{ width: `${Math.min(pctTiempo, 100)}%` }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className={`text-[11px] ${D.textSub}`}>Gasto ejecutado</span>
                  <span className={`text-[11px] font-bold ${pctGasto <= pctTiempo + 5 ? 'text-emerald-600' : pctGasto <= 100 ? 'text-amber-600' : 'text-red-600'}`}>{pctGasto.toFixed(0)}%</span>
                </div>
                <div className={`h-2 rounded-full overflow-hidden ${D.bgMuted}`}>
                  <div className={`h-full transition-all ${pctGasto <= pctTiempo + 5 ? 'bg-emerald-500' : pctGasto <= 100 ? 'bg-amber-500' : 'bg-red-500'}`} style={{ width: `${Math.min(pctGasto, 100)}%` }} />
                </div>
              </div>
            </div>

            {/* Veredicto */}
            {esMesActivo && (
              <div className={`rounded-xl p-2.5 mb-3 text-xs font-medium flex items-center gap-2 ${enRitmo ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>
                {enRitmo
                  ? <>✓ Vas en buen ritmo. Llevas {pctGasto.toFixed(0)}% gastado con {pctTiempo.toFixed(0)}% del mes.</>
                  : <>⚠ Vas adelantado. Gastaste {pctGasto.toFixed(0)}% y solo va {pctTiempo.toFixed(0)}% del mes.</>}
              </div>
            )}

            {/* Excedente proyectado */}
            <div className={`flex items-center justify-between rounded-xl p-2.5 mb-3 ${D.bgMuted}`}>
              <span className={`text-[11px] ${D.textSub}`}>Excedente proyectado</span>
              <span className={`text-sm font-bold ${stats.balanceProy >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                {hidden ? `${config.moneda} ••••` : `${stats.balanceProy >= 0 ? '+' : ''}${formatMonto(stats.balanceProy, config.moneda)}`}
              </span>
            </div>

            {/* Alertas de categorías */}
            {alertas.length > 0 ? (
              <div>
                <p className={`text-[10px] uppercase tracking-widest mb-1.5 ${D.textMuted}`}>⚠ Atención en</p>
                <div className="space-y-1.5">
                  {alertas.map(a => (
                    <div key={a.id} className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg flex items-center justify-center text-sm flex-shrink-0" style={{ backgroundColor: (a.color || '#8D99AE') + '22' }}>{a.emoji}</div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between">
                          <span className={`text-[11px] font-medium ${D.text} truncate`}>{a.nombre}</span>
                          <span className={`text-[11px] font-bold ${a.pct > 100 ? 'text-red-600' : 'text-amber-600'}`}>{a.pct >= 999 ? 'S/P' : `${a.pct.toFixed(0)}%`}</span>
                        </div>
                        <div className={`h-1.5 rounded-full overflow-hidden mt-0.5 ${D.bgMuted}`}>
                          <div className={`h-full ${a.pct > 100 ? 'bg-red-500' : 'bg-amber-500'}`} style={{ width: `${Math.min(a.pct, 100)}%` }} />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : esMesActivo && (
              <p className={`text-[11px] text-center ${D.textMuted}`}>✓ Ninguna categoría en alerta</p>
            )}
          </div>
        );
      })()}

      {/* Últimos movimientos REALES */}
      <div>
        <h2 className={`font-serif text-lg font-semibold mb-2 px-1 ${D.text}`}>Últimos movimientos reales</h2>
        {ultimos.length === 0 ? (
          <div className={`rounded-2xl border border-dashed p-6 text-center ${D.bgCard} ${D.borderMuted}`}>
            <p className={`text-sm ${D.textMuted}`}>Sin movimientos reales aún este período</p>
          </div>
        ) : (
          <div className="space-y-1.5">
            {ultimos.map(tx => {
              const c = findCat(tx.tipo, tx.categoria);
              const f = parseFechaLima(tx.fecha);
              return (
                <div key={tx.id} onClick={() => onEditar(tx)} className={`rounded-xl border p-3 flex items-center gap-3 cursor-pointer active:scale-[0.98] transition ${D.bgCard} ${D.border}`}>
                  <div className="w-9 h-9 rounded-lg flex items-center justify-center text-lg flex-shrink-0" style={{ backgroundColor: c.color + '22' }}>{c.emoji}</div>
                  <div className="flex-1 min-w-0">
                    <p className={`font-medium text-sm truncate ${D.text}`}>{tx.detalle || c.nombre}</p>
                    <p className={`text-[11px] ${D.textMuted}`}>{formatFechaCorta(f)}{extraerHora(tx.fecha) ? ` ${extraerHora(tx.fecha)}` : ''} · {c.nombre}</p>
                  </div>
                  <div className={`font-serif font-semibold text-sm ${tx.tipo === 'gasto' ? D.text : 'text-emerald-600'}`}>
                    {tx.tipo === 'gasto' ? '−' : '+'}{formatMonto(tx.monto, config.moneda).replace(config.moneda + ' ', '')}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

// ============ REGISTRO ============
function Registro({ transacciones, catGasto, catIngreso, config, D, mesActual, onNavMes, onMarcarReal, onEditar, onEliminar, filtroInicial, onFiltroUsado }) {
  const [filtro, setFiltro] = useState(filtroInicial || 'real');
  
  // Si viene un filtro externo, aplicarlo
  React.useEffect(() => {
    if (filtroInicial) {
      setFiltro(filtroInicial);
      onFiltroUsado?.();
    }
  }, [filtroInicial]);
  const findCat = (tipo, id) => {
    const cats = tipo === 'gasto' ? catGasto : catIngreso;
    return cats.find(c => c.id === id) || { emoji: '📦', nombre: (id||'Otros').replace(/_/g,' '), color: '#8D99AE' };
  };

  const filtradas = useMemo(() => {
    let f = [...transacciones];
    if (filtro === 'proyectado') f = f.filter(t => t.tipoRegistro === 'proyectado');
    else if (filtro === 'real') f = f.filter(t => t.tipoRegistro === 'real');
    else if (filtro === 'gasto') f = f.filter(t => t.tipo === 'gasto');
    else if (filtro === 'ingreso') f = f.filter(t => t.tipo === 'ingreso');
    return f.sort((a, b) => (b.fecha || '').localeCompare(a.fecha || ''));
  }, [transacciones, filtro]);

  return (
    <div className="space-y-3 animate-fade-in">
      <h1 className={`font-serif text-2xl font-semibold ${D.text}`}>Registros</h1>

      {/* Nav mes */}
      <div className={`flex items-center justify-between rounded-2xl border p-2.5 ${D.bgCard} ${D.border}`}>
        <button onClick={() => onNavMes(-1)} className="p-1.5"><ChevronLeft className={`w-5 h-5 ${D.text}`} /></button>
        <div className="text-center">
          <div className={`font-serif text-base font-semibold ${D.text}`}>{formatFechaCorta(mesActual.inicio)} – {formatFechaCorta(mesActual.fin)}</div>
          <div className={`text-[10px] uppercase tracking-widest ${D.textMuted}`}>{NOMBRES_MES_LARGO[mesActual.inicio.getMonth()]} {mesActual.inicio.getFullYear()}</div>
        </div>
        <button onClick={() => onNavMes(1)} className="p-1.5"><ChevronRight className={`w-5 h-5 ${D.text}`} /></button>
      </div>

      {/* Filtros */}
      <div className="flex gap-1.5 overflow-x-auto pb-0.5 -mx-1 px-1">
        {['todos','real','proyectado','gasto','ingreso'].map(f => (
          <button key={f} onClick={() => setFiltro(f)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition capitalize ${filtro === f ? 'bg-stone-900 text-white' : D.bgCard + ' border ' + D.border + ' ' + D.textSub}`}>
            {f === 'todos' ? 'Todos' : f === 'proyectado' ? 'Presupuesto' : f === 'real' ? 'Real' : f === 'gasto' ? 'Gastos' : 'Ingresos'}
          </button>
        ))}
      </div>

      {/* Lista */}
      {filtradas.length === 0 ? (
        <div className={`rounded-2xl border border-dashed p-8 text-center ${D.bgCard} ${D.borderMuted}`}>
          <p className={`text-sm ${D.textMuted}`}>Sin registros con este filtro</p>
        </div>
      ) : (
        <div className="space-y-1.5">
          {filtradas.map(tx => {
            const c = findCat(tx.tipo, tx.categoria);
            const f = parseFechaLima(tx.fecha);
            const esProy = tx.tipoRegistro === 'proyectado';
            return (
              <div key={tx.id} onClick={() => onEditar(tx)} className={`rounded-xl border p-3 flex items-center gap-3 cursor-pointer active:scale-[0.98] transition ${D.bgCard} ${D.border}`}>
                <div className="w-9 h-9 rounded-lg flex items-center justify-center text-lg flex-shrink-0" style={{ backgroundColor: c.color + '22' }}>{c.emoji}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <p className={`font-medium text-sm truncate ${D.text}`}>{tx.detalle || c.nombre}</p>
                    {esProy && <span className="text-[8px] uppercase tracking-wide bg-stone-200 text-stone-600 px-1 py-0.5 rounded font-bold">Presup.</span>}
                    {tx.grupoId && <Repeat className="w-3 h-3 text-stone-400" />}
                  </div>
                  <p className={`text-[11px] ${D.textMuted}`}>{formatFechaCorta(f)}{extraerHora(tx.fecha) ? ` ${extraerHora(tx.fecha)}` : ''} · {c.nombre}</p>
                </div>
                <div className={`font-serif font-semibold text-sm ${tx.tipo === 'gasto' ? D.text : 'text-emerald-600'}`}>
                  {tx.tipo === 'gasto' ? '−' : '+'}{formatMonto(tx.monto, config.moneda).replace(config.moneda + ' ', '')}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ============ ANÁLISIS ============
function Analisis({ transacciones, catGasto, catIngreso, config, D }) {
  const [filtro, setFiltro] = useState('mes');
  const [selectedCat, setSelectedCat] = useState(null);
  const [expandedCat, setExpandedCat] = useState(null);
  const [stickyChart, setStickyChart] = useState(true);
  const [showFiltros, setShowFiltros] = useState(false);

  const accentColor = ACENTOS[config.acento || 'amber'].dot;

  // Meses según filtro
  const meses = useMemo(() => {
    const hoy = nowLocal();
    let numMeses = filtro === 'mes' ? 1 : filtro === '3m' ? 3 : filtro === '6m' ? 6 : 12;
    const rangos = [];
    for (let i = numMeses - 1; i >= 0; i--) {
      const ref = new Date(hoy); ref.setMonth(ref.getMonth() - i);
      const rango = getRangoMesFinanciero(ref, config.diaInicioMes, config.ajustarFinDeSemana);
      const key = `${rango.inicio.getFullYear()}-${String(rango.inicio.getMonth()+1).padStart(2,'0')}`;
      if (rangos.find(r => r.key === key)) continue;
      const txs = transacciones.filter(t => {
        if (!t.fecha) return false;
        const f = parseFechaLima(extraerFecha(t.fecha));
        return f >= rango.inicio && f <= rango.fin;
      });
      const gp = txs.filter(t => t.tipo === 'gasto' && t.tipoRegistro === 'proyectado').reduce((s,t) => s + Number(t.monto), 0);
      const gr = txs.filter(t => t.tipo === 'gasto' && t.tipoRegistro === 'real').reduce((s,t) => s + Number(t.monto), 0);
      rangos.push({ key, label: NOMBRES_MES_LARGO[rango.inicio.getMonth()].slice(0,3), fullLabel: NOMBRES_MES_LARGO[rango.inicio.getMonth()], gp, gr, txs });
    }
    return rangos;
  }, [transacciones, config, filtro]);

  // Chart data filtrado por categoría
  const chartData = useMemo(() => {
    if (!selectedCat) return meses;
    return meses.map(m => {
      const catTxs = m.txs.filter(t => t.tipo === 'gasto' && t.categoria === selectedCat);
      return { ...m,
        gp: catTxs.filter(t => t.tipoRegistro === 'proyectado').reduce((s,t) => s + Number(t.monto), 0),
        gr: catTxs.filter(t => t.tipoRegistro === 'real').reduce((s,t) => s + Number(t.monto), 0),
      };
    });
  }, [meses, selectedCat]);

  const maxGasto = Math.max(...chartData.map(m => Math.max(m.gp, m.gr)), 1);
  const allTxsPeriod = useMemo(() => meses.flatMap(m => m.txs), [meses]);

  // Categorías del período
  const analisisCat = useMemo(() => {
    const map = {};
    allTxsPeriod.filter(t => t.tipo === 'gasto').forEach(t => {
      const catId = t.categoria;
      if (!map[catId]) map[catId] = { proy: 0, real: 0, subs: {} };
      if (t.tipoRegistro === 'proyectado') map[catId].proy += Number(t.monto);
      else map[catId].real += Number(t.monto);
      const sub = t.subcategoria || '';
      if (sub) {
        if (!map[catId].subs[sub]) map[catId].subs[sub] = { proy: 0, real: 0 };
        if (t.tipoRegistro === 'proyectado') map[catId].subs[sub].proy += Number(t.monto);
        else map[catId].subs[sub].real += Number(t.monto);
      }
    });
    const items = Object.entries(map).map(([catId, v]) => {
      const cat = catGasto.find(c => c.id === catId) || { emoji: '📦', nombre: catId, color: '#8D99AE' };
      const ejec = v.proy > 0 ? (v.real / v.proy) * 100 : null;
      const subs = Object.entries(v.subs).map(([name, sv]) => ({ name, ...sv })).filter(s => s.proy > 0 || s.real > 0);
      return { id: catId, emoji: cat.emoji, nombre: cat.nombre, color: cat.color, proy: v.proy, real: v.real, ejec, subs };
    });
    const active = items.filter(c => c.real > 0 || c.proy > 0).sort((a, b) => b.real - a.real);
    const inactive = items.filter(c => c.real === 0 && c.proy === 0);
    return [...active, ...inactive];
  }, [allTxsPeriod, catGasto]);

  // Donut data
  const totalReal = analisisCat.reduce((s, c) => s + c.real, 0);
  const donutData = useMemo(() => {
    if (totalReal === 0) return [];
    return analisisCat.filter(c => c.real > 0).map(c => ({ ...c, pct: (c.real / totalReal) * 100 })).sort((a, b) => b.pct - a.pct);
  }, [analisisCat, totalReal]);

  const barColor = (ejec) => ejec === null ? 'bg-stone-400' : ejec <= 80 ? 'bg-emerald-500' : ejec <= 100 ? 'bg-amber-500' : 'bg-red-500';
  const badgeColor = (ejec) => ejec === null ? 'bg-stone-100 text-stone-500' : ejec <= 80 ? 'bg-emerald-50 text-emerald-700' : ejec <= 100 ? 'bg-amber-50 text-amber-700' : 'bg-red-50 text-red-700';

  // SVG Donut
  const DonutChart = ({ data, size = 160 }) => {
    const cx = size / 2, cy = size / 2, r = size / 2 - 16;
    const circ = 2 * Math.PI * r;
    let offset = 0;
    return (
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="mx-auto block">
        {data.map(d => {
          const len = (d.pct / 100) * circ;
          const el = <circle key={d.id} cx={cx} cy={cy} r={r} fill="none" stroke={d.color || '#8D99AE'} strokeWidth={22} strokeDasharray={`${len} ${circ - len}`} strokeDashoffset={-offset} transform={`rotate(-90 ${cx} ${cy})`} className="cursor-pointer" onClick={() => setSelectedCat(selectedCat === d.id ? null : d.id)} />;
          offset += len;
          return el;
        })}
      </svg>
    );
  };

  const selectedCatData = selectedCat ? analisisCat.find(c => c.id === selectedCat) : null;
  const periodoLabel = filtro === 'mes' ? (meses[0]?.fullLabel || 'Mes actual') : filtro === '3m' ? '3 meses' : filtro === '6m' ? '6 meses' : 'Año';
  const showMultiMonth = filtro !== 'mes' || selectedCat;

  return (
    <div className="animate-fade-in">
      <h1 className={`font-serif text-2xl font-semibold mb-3 ${D.text}`}>Análisis</h1>

      {/* Filtro: Mes actual por defecto + desplegable para otros */}
      <div className="flex items-center gap-2 mb-4">
        <button onClick={() => { setFiltro('mes'); setSelectedCat(null); setShowFiltros(false); }}
          className={`py-2 px-4 rounded-xl text-xs font-medium border transition ${filtro === 'mes' ? 'bg-stone-900 text-white border-stone-900' : D.bgCard + ' ' + D.border + ' ' + D.textSub}`}>
          {meses.length === 1 ? meses[0]?.fullLabel || 'Mes actual' : 'Mes actual'}
        </button>
        <div className="relative">
          <button onClick={() => setShowFiltros(!showFiltros)}
            className={`py-2 px-3 rounded-xl text-xs font-medium border transition flex items-center gap-1 ${filtro !== 'mes' ? 'bg-stone-900 text-white border-stone-900' : D.bgCard + ' ' + D.border + ' ' + D.textSub}`}>
            {filtro === '3m' ? '3 meses' : filtro === '6m' ? '6 meses' : filtro === 'year' ? 'Año' : 'Más'} <ChevronRight className={`w-3 h-3 transition ${showFiltros ? 'rotate-90' : ''}`} />
          </button>
          {showFiltros && (
            <div className={`absolute top-full left-0 mt-1 rounded-xl shadow-lg border z-20 overflow-hidden ${D.bgCard} ${D.border}`}>
              {[{id:'3m',l:'3 meses'},{id:'6m',l:'6 meses'},{id:'year',l:'Año'}].map(f => (
                <button key={f.id} onClick={() => { setFiltro(f.id); setSelectedCat(null); setShowFiltros(false); }}
                  className={`block w-full text-left px-4 py-2.5 text-xs font-medium transition ${filtro === f.id ? D.accentText + ' ' + D.bgMuted : D.text} hover:${D.bgMuted}`}>
                  {f.l}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Gráfico sticky — barras superpuestas (presupuesto atrás, real delante) */}
      <div className={`rounded-2xl border p-4 ${D.bgCard} ${D.border} ${stickyChart ? 'sticky z-10 shadow-md' : ''}`}
        style={stickyChart ? { top: 'env(safe-area-inset-top, 0px)' } : undefined}>
        <div className="flex items-center justify-between mb-2">
          <p className={`text-[10px] uppercase tracking-widest ${D.textMuted}`}>
            {selectedCatData ? `${selectedCatData.emoji} ${selectedCatData.nombre}` : 'Gastos'}: Presup. vs Real
          </p>
          <div className="flex items-center gap-1">
            {selectedCat && <button onClick={() => setSelectedCat(null)} className={`text-[10px] px-2 py-1 rounded-full ${D.bgMuted} ${D.textMuted}`}>✕</button>}
            <button onClick={() => setStickyChart(s => !s)} className={`p-1 rounded-full transition ${stickyChart ? 'bg-amber-100 text-amber-700' : D.bgMuted + ' ' + D.textMuted}`}>
              <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill={stickyChart ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" /></svg>
            </button>
          </div>
        </div>
        <div className="flex items-end gap-1" style={{ height: showMultiMonth ? 150 : 120 }}>
          {chartData.map(m => {
            const pctProy = m.gp / maxGasto;
            const pctReal = m.gr / maxGasto;
            const barH = showMultiMonth ? 120 : 90;
            const hProy = pctProy * barH;
            const hReal = pctReal * barH;
            const ejec = m.gp > 0 ? ((m.gr / m.gp) * 100).toFixed(0) + '%' : '';
            return (
              <div key={m.key} className="flex-1 flex flex-col items-center gap-0.5">
                {m.gr > 0 && <span className={`text-[7px] font-bold ${D.textMuted}`}>{m.gr >= 1000 ? `${(m.gr/1000).toFixed(1)}k` : m.gr.toFixed(0)}</span>}
                {ejec && m.gr > 0 && <span className={`text-[7px] italic ${m.gr/m.gp <= 0.8 ? 'text-emerald-600' : m.gr/m.gp <= 1 ? 'text-amber-600' : 'text-red-600'}`}>{ejec}</span>}
                <div className="w-full flex justify-center" style={{ height: barH }}>
                  <div className="relative flex items-end" style={{ width: '70%' }}>
                    {/* Presupuesto detrás */}
                    <div className={`absolute bottom-0 w-full rounded-t ${D.bgMuted}`} style={{ height: Math.max(hProy, m.gp > 0 ? 4 : 0) }} />
                    {/* Real delante */}
                    <div className="absolute bottom-0 w-full rounded-t" style={{ height: Math.max(hReal, m.gr > 0 ? 4 : 0), backgroundColor: selectedCatData?.color || accentColor, opacity: 0.85 }} />
                  </div>
                </div>
                <span className={`text-[9px] ${D.textMuted}`}>{m.label}</span>
              </div>
            );
          })}
        </div>
        <div className="flex items-center gap-4 mt-2">
          <div className="flex items-center gap-1.5"><div className={`w-3 h-3 rounded-sm ${D.bgMuted}`} /><span className={`text-[10px] ${D.textMuted}`}>Presupuesto</span></div>
          <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-sm" style={{ backgroundColor: selectedCatData?.color || accentColor }} /><span className={`text-[10px] ${D.textMuted}`}>Real</span></div>
        </div>
      </div>

      {/* Donut — distribución con leyenda visual como imagen de referencia */}
      {donutData.length > 0 && !selectedCat && (
        <div className={`rounded-2xl border p-4 mt-4 ${D.bgCard} ${D.border}`}>
          <p className={`text-[10px] uppercase tracking-widest mb-3 ${D.textMuted}`}>Distribución del gasto — {periodoLabel}</p>
          <div className="flex items-center gap-4">
            <DonutChart data={donutData} size={140} />
            <div className="flex-1 space-y-1">
              {donutData.slice(0, 8).map(d => (
                <button key={d.id} onClick={() => setSelectedCat(selectedCat === d.id ? null : d.id)}
                  className={`w-full flex items-center gap-2 py-1 px-1.5 rounded-lg text-left transition active:scale-[0.97] ${selectedCat === d.id ? D.bgMuted : ''}`}>
                  <div className="w-3 h-3 rounded-sm flex-shrink-0" style={{ backgroundColor: d.color }} />
                  <span className={`text-[10px] ${D.textSub} truncate flex-1`}>{d.nombre}</span>
                  <span className={`text-[10px] font-bold ${D.text}`}>{d.pct.toFixed(0)}%</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Detalle por categoría */}
      <div className="mt-4">
        <h2 className={`font-serif text-lg font-semibold mb-2 px-1 ${D.text}`}>Detalle — {periodoLabel}</h2>
        <div className="space-y-1.5">
          {analisisCat.map(c => {
            const isZero = c.real === 0 && c.proy === 0;
            return (
              <div key={c.id}>
                <button onClick={() => { setExpandedCat(expandedCat === c.id ? null : c.id); setSelectedCat(selectedCat === c.id ? null : c.id); }}
                  className={`w-full rounded-xl border p-3 text-left transition ${D.bgCard} ${D.border} ${selectedCat === c.id ? 'ring-2 ring-offset-1' : ''} ${isZero ? 'opacity-40' : 'active:scale-[0.99]'}`}
                  style={selectedCat === c.id ? { '--tw-ring-color': c.color } : undefined}>
                  <div className="flex items-center gap-3 mb-1.5">
                    <div className="w-9 h-9 rounded-lg flex items-center justify-center text-lg flex-shrink-0" style={{ backgroundColor: (c.color || '#8D99AE') + '22' }}>{c.emoji}</div>
                    <div className="flex-1 min-w-0">
                      <p className={`font-medium text-sm ${D.text}`}>{c.nombre}</p>
                      <p className={`text-[11px] ${D.textMuted}`}>
                        {isZero ? 'Sin movimientos' : c.ejec !== null ? `${formatMonto(c.real, config.moneda)} / ${formatMonto(c.proy, config.moneda)}` : `${formatMonto(c.real, config.moneda)} real`}
                      </p>
                    </div>
                    {!isZero && <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${badgeColor(c.ejec)}`}>{c.ejec !== null ? `${c.ejec.toFixed(0)}%` : 'S/P'}</span>}
                    {c.subs.length > 0 && <ChevronRight className={`w-4 h-4 transition ${D.textMuted} ${expandedCat === c.id ? 'rotate-90' : ''}`} />}
                  </div>
                  {!isZero && (
                    <div className={`h-1.5 rounded-full overflow-hidden ${D.bgMuted}`}>
                      <div className={`h-full transition-all ${barColor(c.ejec)}`} style={{ width: c.ejec !== null ? `${Math.min(c.ejec, 100)}%` : (c.real > 0 ? '100%' : '0%') }} />
                    </div>
                  )}
                </button>
                {expandedCat === c.id && c.subs.length > 0 && (
                  <div className={`ml-6 mt-1 space-y-1 border-l-2 pl-3 ${D.border}`}>
                    {c.subs.sort((a,b) => b.real - a.real).map(s => {
                      const sEjec = s.proy > 0 ? (s.real / s.proy) * 100 : null;
                      return (
                        <div key={s.name} className={`rounded-lg p-2 ${D.bgMuted}`}>
                          <div className="flex items-center justify-between mb-1">
                            <span className={`text-xs font-medium ${D.textSub}`}>{s.name}</span>
                            <span className={`text-[10px] font-bold ${badgeColor(sEjec)} px-1.5 py-0.5 rounded-full`}>{sEjec !== null ? `${sEjec.toFixed(0)}%` : 'S/P'}</span>
                          </div>
                          <p className={`text-[10px] ${D.textMuted}`}>{sEjec !== null ? `${formatMonto(s.real, config.moneda)} / ${formatMonto(s.proy, config.moneda)}` : formatMonto(s.real, config.moneda)}</p>
                          <div className={`h-1 rounded-full overflow-hidden mt-1 ${D.bgCard}`}>
                            <div className={`h-full ${barColor(sEjec)}`} style={{ width: sEjec !== null ? `${Math.min(sEjec, 100)}%` : (s.real > 0 ? '100%' : '0%') }} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}


// ============ FORMULARIO COMPLETO (MODAL) ============
function FormularioTx({ tx, catGasto, catIngreso, config, transacciones, onGuardar, onEliminar, onCerrar, D }) {
  const [tipo, setTipo] = useState(tx?.tipo || 'gasto');
  const [tipoRegistro, setTipoRegistro] = useState(tx?.tipoRegistro || 'real');
  const [categoria, setCategoria] = useState(tx?.categoria || '');
  const [subcategoria, setSubcategoria] = useState(tx?.subcategoria || '');
  const [detalle, setDetalle] = useState(tx?.detalle || '');
  const [monto, setMonto] = useState(tx?.monto || '');
  const [fecha, setFecha] = useState(tx?.fecha || toISODate(nowLocal()));
  const [veces, setVeces] = useState(1);
  const [showAllCats, setShowAllCats] = useState(false);
  const cats = tipo === 'gasto' ? catGasto : catIngreso;
  const editando = !!tx?.id;

  const submit = () => {
    if (!categoria || !monto) return;
    onGuardar({ ...(tx?.id ? { id: tx.id, grupoId: tx.grupoId } : {}),
      tipo, tipoRegistro, categoria, subcategoria, detalle,
      monto: parseFloat(monto), fecha, persona: config.persona, veces: editando ? 1 : veces });
  };

  return (
    <div className="fixed inset-0 z-40 bg-black/60 flex items-end justify-center">
      <div className={`w-full max-w-md rounded-t-3xl max-h-[92vh] flex flex-col animate-slide-up shadow-2xl ${D.bg}`}>
        <div className={`px-5 pt-4 pb-3 border-b ${D.bgMuted} ${D.border} rounded-t-3xl`}>
          <div className="flex items-center justify-between mb-2">
            <h2 className={`font-serif text-lg font-semibold ${D.text}`}>{editando ? 'Editar' : 'Registro completo'}</h2>
            <button onClick={onCerrar} className={`p-1.5 rounded-full ${D.bgCard}`}><X className={`w-5 h-5 ${D.text}`} /></button>
          </div>
          <div className={`grid grid-cols-2 gap-1 p-1 rounded-xl ${D.bgMuted}`}>
            {['gasto','ingreso'].map(t => (
              <button key={t} onClick={() => { setTipo(t); setCategoria(''); }}
                className={`py-1.5 rounded-lg text-xs font-medium transition capitalize ${tipo === t ? D.bgCard + ' shadow-sm ' + D.text : D.textMuted}`}>
                {t === 'gasto' ? '💸 Gasto' : '💰 Ingreso'}
              </button>
            ))}
          </div>
        </div>
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
          {/* Monto */}
          <div className="text-center py-1">
            <div className="flex items-center justify-center gap-1.5">
              <span className={`font-serif text-xl ${D.textMuted}`}>{config.moneda}</span>
              <input type="number" inputMode="decimal" value={monto} onChange={e => setMonto(e.target.value)} placeholder="0.00"
                autoFocus={!editando} className={`font-serif text-4xl font-semibold bg-transparent text-center w-44 outline-none placeholder:text-stone-400 ${D.text}`} />
            </div>
            <div className="flex gap-2 justify-center mt-2">
              {['real','proyectado'].map(t => (
                <button key={t} onClick={() => setTipoRegistro(t)}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition ${tipoRegistro === t ? 'bg-stone-900 text-white' : D.bgCard + ' border ' + D.border + ' ' + D.textSub}`}>
                  {t === 'real' ? '⚡ Real' : '📅 Presup.'}
                </button>
              ))}
            </div>
          </div>
          {/* Categorías */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className={`text-[10px] uppercase tracking-widest ${D.textMuted}`}>Categoría</label>
            </div>
            <div className="grid grid-cols-3 gap-1.5 max-h-48 overflow-y-auto">
              {cats.map(c => (
                <button key={c.id} onClick={() => setCategoria(c.id)}
                  className={`p-2 rounded-xl border-2 flex flex-col items-center gap-0.5 transition ${D.bgCard} ${categoria === c.id ? '' : D.border}`}
                  style={{ borderColor: categoria === c.id ? c.color : undefined }}>
                  <span className="text-lg">{c.emoji}</span>
                  <span className={`text-[9px] font-medium text-center leading-tight ${D.textSub}`}>{c.nombre}</span>
                </button>
              ))}
            </div>
          </div>
          {/* Fecha */}
          <div>
            <label className={`text-[10px] uppercase tracking-widest mb-1 block ${D.textMuted}`}>Fecha</label>
            <input type="date" value={fecha} onChange={e => setFecha(e.target.value)} className={`w-full px-3 py-2 rounded-xl text-sm border outline-none ${D.bgInput} ${D.border} ${D.text}`} />
          </div>
          {/* Recurrencia */}
          {!editando && (
            <div>
              <label className={`text-[10px] uppercase tracking-widest mb-1.5 block ${D.textMuted}`}>Repetir</label>
              <div className="flex gap-1.5">
                {[1,3,6,12].map(v => (
                  <button key={v} onClick={() => setVeces(v)}
                    className={`flex-1 py-2 rounded-lg text-xs font-medium border transition ${veces === v ? 'bg-stone-900 text-white border-stone-900' : D.bgCard + ' ' + D.border + ' ' + D.textSub}`}>
                    {v === 1 ? 'Solo 1' : `${v} meses`}
                  </button>
                ))}
              </div>
            </div>
          )}
          {/* Detalle / subcategoría */}
          <input type="text" value={detalle} onChange={e => setDetalle(e.target.value)} placeholder="Detalle (opcional)"
            className={`w-full px-3 py-2 rounded-xl text-sm border outline-none ${D.bgInput} ${D.border} ${D.text}`} />
          <input type="text" value={subcategoria} onChange={e => setSubcategoria(e.target.value)} placeholder="Subcategoría (opcional)"
            className={`w-full px-3 py-2 rounded-xl text-sm border outline-none ${D.bgInput} ${D.border} ${D.text}`} />
        </div>
        <div className={`px-5 py-3 border-t ${D.bgMuted} ${D.border}`}>
          <button onClick={submit} className="w-full py-3 bg-stone-900 text-white font-semibold rounded-xl transition active:scale-[0.98]">
            {editando ? 'Actualizar' : 'Guardar'}
          </button>
          {editando && (
            <button onClick={() => {
              if (confirm('¿Eliminar este registro?')) { onEliminar(tx.id); onCerrar(); }
            }} className="w-full mt-2 py-2.5 rounded-xl text-sm font-medium text-red-500 border border-red-200 bg-red-50 transition active:scale-[0.98]">
              <Trash2 className="w-4 h-4 inline mr-1.5" />Eliminar registro
            </button>
          )}
          {editando && tx.grupoId && (
            <button onClick={() => {
              if (confirm('¿Eliminar este y todos los futuros del grupo?')) { onEliminar(tx.id, false); onCerrar(); }
            }} className={`w-full mt-1.5 py-2 rounded-xl text-xs font-medium ${D.textMuted} border ${D.border} transition`}>
              Eliminar este y futuros del grupo
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ============ CONFIG ============
function Config({ config, setConfig, catGasto, catIngreso, onGuardarCat, onEliminarCat,
  onExport, totalTx, scriptUrl, setScriptUrl, transacciones, onSincronizar, syncStatus, D, isDark, paises, sugerGasto, sugerIngreso, online }) {
  const [showCats, setShowCats] = useState(null);
  const [nuevaCat, setNuevaCat] = useState({ nombre: '', emoji: '📦', color: '#8D99AE' });
  const [editandoCat, setEditandoCat] = useState(null);
  const [tempUrl, setTempUrl] = useState(scriptUrl || '');
  const [migrating, setMigrating] = useState(false);
  const cats = showCats === 'gasto' ? catGasto : catIngreso;

  const handleGuardarCat = () => {
    if (!nuevaCat.nombre.trim()) return;
    const id = nuevaCat.id || nuevaCat.nombre.toLowerCase().normalize('NFD').replace(/[^a-z0-9]/g, '_').replace(/_+/g,'_');
    onGuardarCat({ ...nuevaCat, id, activo: true }, showCats);
    setNuevaCat({ nombre: '', emoji: '📦', color: '#8D99AE' }); setEditandoCat(null);
  };

  return (
    <div className="space-y-4 animate-fade-in">
      <h1 className={`font-serif text-2xl font-semibold ${D.text}`}>Ajustes</h1>

      {/* Persona */}
      <Sec D={D} t="Tu nombre">
        <input type="text" value={config.persona} onChange={e => setConfig({ ...config, persona: e.target.value })}
          className={`w-full px-3.5 py-2.5 rounded-xl text-sm outline-none border ${D.bgInput} ${D.border} ${D.text}`} />
      </Sec>

      {/* Período */}
      <Sec D={D} t="Día de inicio">
        <div className="flex items-center gap-2">
          <input type="number" min="1" max="28" value={config.diaInicioMes}
            onChange={e => setConfig({ ...config, diaInicioMes: parseInt(e.target.value) || 1 })}
            className={`w-20 px-3 py-2 rounded-xl text-center font-serif text-lg border outline-none ${D.bgInput} ${D.border} ${D.text}`} />
          <span className={`text-sm ${D.textSub}`}>de cada mes</span>
        </div>
        <label className="flex items-center gap-2 mt-2 cursor-pointer">
          <input type="checkbox" checked={config.ajustarFinDeSemana} onChange={e => setConfig({ ...config, ajustarFinDeSemana: e.target.checked })} className="w-4 h-4" />
          <span className={`text-sm ${D.textSub}`}>Ajustar a viernes si cae fin de semana</span>
        </label>
      </Sec>

      {/* Moneda */}
      <Sec D={D} t="Moneda">
        <div className="flex gap-2">
          {['S/.','$','€','£'].map(m => (
            <button key={m} onClick={() => setConfig({ ...config, moneda: m })}
              className={`flex-1 py-2 rounded-xl border-2 font-serif text-lg ${config.moneda === m ? 'border-stone-900 bg-stone-900 text-white' : D.border + ' ' + D.bgCard}`}>{m}</button>
          ))}
        </div>
      </Sec>

      {/* País */}
      <Sec D={D} t="País">
        <p className={`text-xs mb-2 ${D.textMuted}`}>La zona horaria y moneda se ajustan según tu país</p>
        <div className="grid grid-cols-2 gap-1.5 max-h-48 overflow-y-auto">
          {(paises || []).map(p => (
            <button key={p.code} onClick={async () => {
                const newCfg = { ...config, pais: p.code, moneda: p.moneda };
                setConfig(newCfg); APP_TZ = p.tz;
                saveL(KEYS.CONFIG, newCfg);
                if (scriptUrl) { try { await apiSaveSetting(scriptUrl, 'pais', p.code); } catch {} }
              }}
              className={`p-2.5 rounded-xl border-2 flex items-center gap-2 text-left transition text-sm ${config.pais === p.code ? 'border-stone-900 ' + D.bgMuted : D.border + ' ' + D.bgCard}`}>
              <span className="text-lg">{p.emoji}</span>
              <span className={`font-medium ${D.text}`}>{p.nombre}</span>
            </button>
          ))}
        </div>
      </Sec>

      {/* Apariencia */}
      <Sec D={D} t="Apariencia">
        <p className={`text-[10px] uppercase tracking-widest mb-2 ${D.textMuted}`}>Tema</p>
        <div className="grid grid-cols-3 gap-2 mb-3">
          {[{id:'claro',e:'☀️',l:'Claro'},{id:'oscuro',e:'🌙',l:'Oscuro'},{id:'auto',e:'⚙️',l:'Sistema'}].map(t => (
            <button key={t.id} onClick={() => setConfig({ ...config, tema: t.id })}
              className={`p-3 rounded-xl border-2 flex flex-col items-center gap-1 transition ${config.tema === t.id ? 'border-stone-900 ' + D.bgMuted : D.border + ' ' + D.bgCard}`}>
              <span className="text-xl">{t.e}</span><span className={`text-[11px] font-medium ${D.textSub}`}>{t.l}</span>
            </button>
          ))}
        </div>
        <p className={`text-[10px] uppercase tracking-widest mb-2 ${D.textMuted}`}>Acento</p>
        <div className="flex gap-1.5 flex-wrap">
          {Object.entries(ACENTOS).map(([id, a]) => (
            <button key={id} onClick={() => setConfig({ ...config, acento: id })}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-full border-2 text-xs font-medium transition ${config.acento === id ? 'border-stone-900' : D.border} ${D.bgCard}`}>
              <span className="w-3 h-3 rounded-full" style={{ backgroundColor: a.dot }} />
              <span className={D.textSub}>{a.label}</span>
            </button>
          ))}
        </div>
      </Sec>

      {/* Categorías */}
      <Sec D={D} t="Categorías">
        <div className="grid grid-cols-2 gap-2">
          {['gasto','ingreso'].map(t => (
            <button key={t} onClick={() => { setShowCats(t); setEditandoCat(null); }}
              className={`p-3 rounded-xl border text-sm font-medium text-left ${D.bgCard} ${D.border} ${D.text}`}>
              {t === 'gasto' ? '💸 Gastos' : '💰 Ingresos'} <span className={D.textMuted}>({(t === 'gasto' ? catGasto : catIngreso).length})</span>
            </button>
          ))}
        </div>
      </Sec>

      {/* Conexión Sheets */}
      <Sec D={D} t="Google Sheets">
        <div className="flex items-center gap-2 mb-2">
          <div className={`w-2 h-2 rounded-full ${scriptUrl ? (syncStatus === 'error' ? 'bg-red-500' : syncStatus === 'syncing' ? 'bg-amber-500 animate-pulse' : 'bg-emerald-500') : 'bg-stone-400'}`} />
          <span className={`text-xs ${D.textSub}`}>{!scriptUrl ? 'Sin conectar' : syncStatus === 'syncing' ? 'Sincronizando...' : 'Conectado ✓'}</span>
        </div>
        <input type="url" value={tempUrl} onChange={e => setTempUrl(e.target.value)} placeholder="https://script.google.com/macros/s/.../exec"
          className={`w-full px-3 py-2 rounded-xl text-xs border outline-none font-mono ${D.bgInput} ${D.border} ${D.text}`} />
        <div className="grid grid-cols-2 gap-2 mt-2">
          <button onClick={() => { setScriptUrl(tempUrl.trim()); setTimeout(() => location.reload(), 300); }}
            disabled={!tempUrl.trim() || tempUrl === scriptUrl} className="py-2.5 bg-stone-900 text-white rounded-xl text-sm font-medium disabled:opacity-30">Guardar</button>
          <button onClick={onSincronizar} disabled={!scriptUrl || syncStatus === 'syncing'}
            className={`py-2.5 rounded-xl text-sm font-medium border disabled:opacity-30 ${D.bgCard} ${D.border} ${D.text}`}>🔄 Sync</button>
        </div>
      </Sec>

      {/* Datos */}
      <Sec D={D} t="Datos">
        <p className={`text-xs mb-2 ${D.textMuted}`}>{totalTx} registros</p>
        <button onClick={onExport} className={`w-full py-2.5 rounded-xl text-sm font-medium border ${D.bgCard} ${D.border} ${D.text}`}><Download className="w-4 h-4 inline mr-1" />Exportar CSV</button>
      </Sec>

      {/* Modal categorías */}
      {showCats && (
        <div className="fixed inset-0 z-40 bg-black/60 flex items-end justify-center">
          <div className={`w-full max-w-md rounded-t-3xl max-h-[85vh] flex flex-col animate-slide-up shadow-2xl ${D.bg}`}>
            <div className={`px-5 pt-4 pb-3 border-b ${D.bgMuted} ${D.border} flex items-center justify-between rounded-t-3xl`}>
              <h2 className={`font-serif text-lg font-semibold ${D.text}`}>{showCats === 'gasto' ? '💸 Gastos' : '💰 Ingresos'}</h2>
              <button onClick={() => setShowCats(null)} className={`p-1.5 rounded-full ${D.bgCard}`}><X className={`w-5 h-5 ${D.text}`} /></button>
            </div>
            <div className="flex-1 overflow-y-auto px-5 py-3 space-y-1.5">
              {cats.map(c => (
                <div key={c.id} className={`rounded-xl border p-3 flex items-center gap-2 ${D.bgCard} ${D.border}`}>
                  {/* Flechas de orden */}
                  <div className="flex flex-col gap-0.5">
                    <button onClick={() => {
                      const idx = cats.indexOf(c);
                      if (idx <= 0) return;
                      const newCats = [...cats];
                      [newCats[idx-1], newCats[idx]] = [newCats[idx], newCats[idx-1]];
                      newCats.forEach((cat, j) => onGuardarCat({ ...cat, orden: j+1 }, showCats));
                    }} className={`text-xs p-0.5 rounded ${D.textMuted} hover:${D.bgMuted}`}>▲</button>
                    <button onClick={() => {
                      const idx = cats.indexOf(c);
                      if (idx >= cats.length - 1) return;
                      const newCats = [...cats];
                      [newCats[idx], newCats[idx+1]] = [newCats[idx+1], newCats[idx]];
                      newCats.forEach((cat, j) => onGuardarCat({ ...cat, orden: j+1 }, showCats));
                    }} className={`text-xs p-0.5 rounded ${D.textMuted} hover:${D.bgMuted}`}>▼</button>
                  </div>
                  <div className="w-9 h-9 rounded-lg flex items-center justify-center text-lg flex-shrink-0" style={{ backgroundColor: c.color + '22' }}>{c.emoji}</div>
                  <span className={`flex-1 text-sm font-medium ${D.text}`}>{c.nombre}</span>
                  <button onClick={() => { setEditandoCat(c); setNuevaCat({...c}); }} className={`text-xs px-2 py-1 rounded border ${D.bgMuted} ${D.border} ${D.textSub}`}>✏️</button>
                  <button onClick={() => { if(confirm('¿Eliminar?')) onEliminarCat(c.id, showCats); }} className="text-red-500 p-1"><Trash2 className="w-3.5 h-3.5" /></button>
                </div>
              ))}
            </div>
            <div className={`border-t px-5 py-3 ${D.bgMuted} ${D.border}`}>
              {/* Botón importar sugeridas */}
              {((showCats === 'gasto' ? catGasto : catIngreso).length === 0) && (
                <button onClick={() => {
                  const suger = showCats === 'gasto' ? sugerGasto : sugerIngreso;
                  suger.forEach(c => onGuardarCat({ ...c, activo: true }, showCats));
                }} className="w-full mb-3 py-2.5 rounded-xl border-2 border-dashed text-sm font-medium transition border-amber-300 bg-amber-50 text-amber-700 hover:bg-amber-100">
                  ✨ Agregar categorías sugeridas ({(showCats === 'gasto' ? sugerGasto : sugerIngreso).length})
                </button>
              )}
              <div className="flex gap-2 mb-2">
                <input type="text" value={nuevaCat.emoji} onChange={e => setNuevaCat({...nuevaCat, emoji: e.target.value})} maxLength={2}
                  className={`w-12 px-2 py-2 border rounded-lg text-center text-xl ${D.bgInput} ${D.border}`} />
                <input type="text" value={nuevaCat.nombre} onChange={e => setNuevaCat({...nuevaCat, nombre: e.target.value})} placeholder="Nombre"
                  className={`flex-1 px-3 py-2 border rounded-lg text-sm ${D.bgInput} ${D.border} ${D.text}`} />
              </div>
              <div className="flex gap-1.5 mb-2 flex-wrap">
                {['#E76F51','#F4A261','#2A9D8F','#264653','#8338EC','#FF006E','#3A86FF','#06D6A0','#EF233C','#FFD60A'].map(c => (
                  <button key={c} onClick={() => setNuevaCat({...nuevaCat, color: c})}
                    className={`w-6 h-6 rounded-full ${nuevaCat.color === c ? 'ring-2 ring-offset-1 ring-stone-900' : ''}`} style={{ backgroundColor: c }} />
                ))}
              </div>
              <button onClick={handleGuardarCat} disabled={!nuevaCat.nombre.trim()} className="w-full py-2 bg-stone-900 text-white rounded-lg text-sm font-medium disabled:opacity-30">
                {editandoCat ? 'Actualizar' : '+ Agregar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Sec({ D, t, children }) {
  return (<div className={`rounded-2xl border p-4 ${D.bgCard} ${D.border}`}><h3 className={`font-serif text-base font-semibold mb-2.5 ${D.text}`}>{t}</h3>{children}</div>);
}
