import React, { useState, useEffect, useMemo } from ‘react’;
import {
Wallet, TrendingUp, TrendingDown, Plus, Trash2, Calendar,
PieChart, BarChart3, Settings, ChevronLeft, ChevronRight,
Download, Upload, X, Check, AlertCircle, Repeat, Zap
} from ‘lucide-react’;

// ============ CATEGORÍAS POR DEFECTO ============
const DEFAULT_CATEGORIAS_GASTO = [
{ id: ‘fijos_vivienda’, nombre: ‘Fijos Vivienda’, emoji: ‘🏠’, color: ‘#E8B4B8’ },
{ id: ‘alimentacion’, nombre: ‘Alimentación’, emoji: ‘🍽️’, color: ‘#F4A261’ },
{ id: ‘transporte’, nombre: ‘Transporte’, emoji: ‘🚌’, color: ‘#2A9D8F’ },
{ id: ‘casa_padres’, nombre: ‘Casa Padres’, emoji: ‘👨‍👩‍👧’, color: ‘#E76F51’ },
{ id: ‘salud’, nombre: ‘Salud’, emoji: ‘💊’, color: ‘#06A77D’ },
{ id: ‘aseo_personal’, nombre: ‘Aseo Personal’, emoji: ‘🧴’, color: ‘#9D4EDD’ },
{ id: ‘mascota’, nombre: ‘Mascota’, emoji: ‘🐾’, color: ‘#D4A373’ },
{ id: ‘educacion’, nombre: ‘Educación’, emoji: ‘📚’, color: ‘#3A86FF’ },
{ id: ‘servicios_digitales’, nombre: ‘Servicios Digitales’, emoji: ‘📱’, color: ‘#8338EC’ },
{ id: ‘inversion’, nombre: ‘Inversión’, emoji: ‘📈’, color: ‘#06D6A0’ },
{ id: ‘ahorro’, nombre: ‘Ahorro’, emoji: ‘💰’, color: ‘#FFD60A’ },
{ id: ‘deuda’, nombre: ‘Deuda’, emoji: ‘💳’, color: ‘#EF233C’ },
{ id: ‘cumpleanos’, nombre: ‘Cumpleaños’, emoji: ‘🎂’, color: ‘#FF006E’ },
{ id: ‘otros’, nombre: ‘Otros’, emoji: ‘📦’, color: ‘#8D99AE’ },
];

const DEFAULT_CATEGORIAS_INGRESO = [
{ id: ‘salario’, nombre: ‘Salario’, emoji: ‘💼’, color: ‘#06A77D’ },
{ id: ‘cts’, nombre: ‘CTS’, emoji: ‘🏦’, color: ‘#3A86FF’ },
{ id: ‘gratificacion’, nombre: ‘Gratificación’, emoji: ‘🎁’, color: ‘#FF006E’ },
{ id: ‘extra’, nombre: ‘Ingreso Extra’, emoji: ‘✨’, color: ‘#FFD60A’ },
{ id: ‘utilidades’, nombre: ‘Utilidades’, emoji: ‘💵’, color: ‘#06D6A0’ },
];

const DEFAULT_CONFIG = {
diaInicioMes: 23,
ajustarFinDeSemana: true,
moneda: ‘S/.’,
persona: ‘Sanat’,
tema: ‘claro’,       // claro | oscuro | auto
acento: ‘amber’,     // amber | emerald | sky | rose | violet
};

// Paleta de acentos
const ACENTOS = {
amber:   { label: ‘Ámbar’,    dot: ‘#d97706’, cls: ‘bg-amber-500’,   text: ‘text-amber-700’,   border: ‘border-amber-500’,   italic: ‘text-amber-700’ },
emerald: { label: ‘Esmeralda’, dot: ‘#059669’, cls: ‘bg-emerald-500’, text: ‘text-emerald-700’, border: ‘border-emerald-500’, italic: ‘text-emerald-700’ },
sky:     { label: ‘Cielo’,    dot: ‘#0284c7’, cls: ‘bg-sky-500’,     text: ‘text-sky-700’,     border: ‘border-sky-500’,     italic: ‘text-sky-700’ },
rose:    { label: ‘Rosa’,     dot: ‘#e11d48’, cls: ‘bg-rose-500’,    text: ‘text-rose-700’,    border: ‘border-rose-500’,    italic: ‘text-rose-700’ },
violet:  { label: ‘Violeta’,  dot: ‘#7c3aed’, cls: ‘bg-violet-500’,  text: ‘text-violet-700’,  border: ‘border-violet-500’,  italic: ‘text-violet-700’ },
};

// ============ DATOS PRE-CARGADOS DE SANAT (desde Google Sheet) ============
const SEED_DATA = [{“id”:“seed_0001”,“tipo”:“ingreso”,“tipoRegistro”:“proyectado”,“categoria”:“salario”,“subcategoria”:””,“detalle”:“Auna”,“monto”:3000.0,“fecha”:“2026-04-23”,“persona”:“Sanat”,“grupoId”:“seedgrp_001”},{“id”:“seed_0002”,“tipo”:“ingreso”,“tipoRegistro”:“proyectado”,“categoria”:“salario”,“subcategoria”:””,“detalle”:“Auna”,“monto”:3000.0,“fecha”:“2026-05-23”,“persona”:“Sanat”,“grupoId”:“seedgrp_001”},{“id”:“seed_0003”,“tipo”:“ingreso”,“tipoRegistro”:“proyectado”,“categoria”:“salario”,“subcategoria”:””,“detalle”:“Auna”,“monto”:3000.0,“fecha”:“2026-06-23”,“persona”:“Sanat”,“grupoId”:“seedgrp_001”},{“id”:“seed_0004”,“tipo”:“ingreso”,“tipoRegistro”:“proyectado”,“categoria”:“salario”,“subcategoria”:””,“detalle”:“Auna”,“monto”:3000.0,“fecha”:“2026-07-23”,“persona”:“Sanat”,“grupoId”:“seedgrp_001”},{“id”:“seed_0005”,“tipo”:“ingreso”,“tipoRegistro”:“proyectado”,“categoria”:“salario”,“subcategoria”:””,“detalle”:“Auna”,“monto”:3000.0,“fecha”:“2026-08-23”,“persona”:“Sanat”,“grupoId”:“seedgrp_001”},{“id”:“seed_0006”,“tipo”:“ingreso”,“tipoRegistro”:“proyectado”,“categoria”:“salario”,“subcategoria”:””,“detalle”:“Auna”,“monto”:3000.0,“fecha”:“2026-09-23”,“persona”:“Sanat”,“grupoId”:“seedgrp_001”},{“id”:“seed_0007”,“tipo”:“ingreso”,“tipoRegistro”:“proyectado”,“categoria”:“salario”,“subcategoria”:””,“detalle”:“Auna”,“monto”:3000.0,“fecha”:“2026-10-23”,“persona”:“Sanat”,“grupoId”:“seedgrp_001”},{“id”:“seed_0008”,“tipo”:“ingreso”,“tipoRegistro”:“proyectado”,“categoria”:“salario”,“subcategoria”:””,“detalle”:“Auna”,“monto”:3000.0,“fecha”:“2026-11-23”,“persona”:“Sanat”,“grupoId”:“seedgrp_001”},{“id”:“seed_0009”,“tipo”:“ingreso”,“tipoRegistro”:“proyectado”,“categoria”:“salario”,“subcategoria”:””,“detalle”:“Auna”,“monto”:3000.0,“fecha”:“2026-12-23”,“persona”:“Sanat”,“grupoId”:“seedgrp_001”},{“id”:“seed_0010”,“tipo”:“ingreso”,“tipoRegistro”:“proyectado”,“categoria”:“salario”,“subcategoria”:””,“detalle”:“Auna”,“monto”:3000.0,“fecha”:“2027-01-23”,“persona”:“Sanat”,“grupoId”:“seedgrp_001”},{“id”:“seed_0011”,“tipo”:“ingreso”,“tipoRegistro”:“proyectado”,“categoria”:“salario”,“subcategoria”:””,“detalle”:“Auna”,“monto”:3000.0,“fecha”:“2027-02-23”,“persona”:“Sanat”,“grupoId”:“seedgrp_001”},{“id”:“seed_0012”,“tipo”:“ingreso”,“tipoRegistro”:“proyectado”,“categoria”:“salario”,“subcategoria”:””,“detalle”:“Auna”,“monto”:3000.0,“fecha”:“2027-03-23”,“persona”:“Sanat”,“grupoId”:“seedgrp_001”},{“id”:“seed_0013”,“tipo”:“ingreso”,“tipoRegistro”:“real”,“categoria”:“salario”,“subcategoria”:””,“detalle”:“Auna”,“monto”:3000.0,“fecha”:“2026-03-23”,“persona”:“Sanat”,“grupoId”:null},{“id”:“seed_0014”,“tipo”:“ingreso”,“tipoRegistro”:“proyectado”,“categoria”:“cts”,“subcategoria”:””,“detalle”:“Auna”,“monto”:2000.0,“fecha”:“2026-05-15”,“persona”:“Sanat”,“grupoId”:“seedgrp_002”},{“id”:“seed_0015”,“tipo”:“ingreso”,“tipoRegistro”:“proyectado”,“categoria”:“cts”,“subcategoria”:””,“detalle”:“Auna”,“monto”:2000.0,“fecha”:“2026-11-13”,“persona”:“Sanat”,“grupoId”:“seedgrp_002”},{“id”:“seed_0016”,“tipo”:“ingreso”,“tipoRegistro”:“proyectado”,“categoria”:“gratificacion”,“subcategoria”:””,“detalle”:“Auna”,“monto”:3800.0,“fecha”:“2026-07-23”,“persona”:“Sanat”,“grupoId”:“seedgrp_003”},{“id”:“seed_0017”,“tipo”:“ingreso”,“tipoRegistro”:“proyectado”,“categoria”:“gratificacion”,“subcategoria”:””,“detalle”:“Auna”,“monto”:3800.0,“fecha”:“2026-12-23”,“persona”:“Sanat”,“grupoId”:“seedgrp_003”},{“id”:“seed_0018”,“tipo”:“ingreso”,“tipoRegistro”:“proyectado”,“categoria”:“gratificacion”,“subcategoria”:“Aguinaldo”,“detalle”:“Auna”,“monto”:200.0,“fecha”:“2026-12-23”,“persona”:“Sanat”,“grupoId”:null},{“id”:“seed_0019”,“tipo”:“gasto”,“tipoRegistro”:“proyectado”,“categoria”:“fijos_vivienda”,“subcategoria”:“Servicios”,“detalle”:“Agua”,“monto”:50.0,“fecha”:“2026-03-30”,“persona”:“Sanat”,“grupoId”:“seedgrp_004”},{“id”:“seed_0020”,“tipo”:“gasto”,“tipoRegistro”:“proyectado”,“categoria”:“fijos_vivienda”,“subcategoria”:“Servicios”,“detalle”:“Agua”,“monto”:50.0,“fecha”:“2026-04-30”,“persona”:“Sanat”,“grupoId”:“seedgrp_004”},{“id”:“seed_0021”,“tipo”:“gasto”,“tipoRegistro”:“proyectado”,“categoria”:“fijos_vivienda”,“subcategoria”:“Servicios”,“detalle”:“Agua”,“monto”:50.0,“fecha”:“2026-05-30”,“persona”:“Sanat”,“grupoId”:“seedgrp_004”},{“id”:“seed_0022”,“tipo”:“gasto”,“tipoRegistro”:“proyectado”,“categoria”:“fijos_vivienda”,“subcategoria”:“Servicios”,“detalle”:“Agua”,“monto”:50.0,“fecha”:“2026-06-30”,“persona”:“Sanat”,“grupoId”:“seedgrp_004”},{“id”:“seed_0023”,“tipo”:“gasto”,“tipoRegistro”:“proyectado”,“categoria”:“fijos_vivienda”,“subcategoria”:“Servicios”,“detalle”:“Agua”,“monto”:50.0,“fecha”:“2026-07-30”,“persona”:“Sanat”,“grupoId”:“seedgrp_004”},{“id”:“seed_0024”,“tipo”:“gasto”,“tipoRegistro”:“proyectado”,“categoria”:“fijos_vivienda”,“subcategoria”:“Servicios”,“detalle”:“Agua”,“monto”:50.0,“fecha”:“2026-08-30”,“persona”:“Sanat”,“grupoId”:“seedgrp_004”},{“id”:“seed_0025”,“tipo”:“gasto”,“tipoRegistro”:“proyectado”,“categoria”:“fijos_vivienda”,“subcategoria”:“Servicios”,“detalle”:“Agua”,“monto”:50.0,“fecha”:“2026-09-30”,“persona”:“Sanat”,“grupoId”:“seedgrp_004”},{“id”:“seed_0026”,“tipo”:“gasto”,“tipoRegistro”:“proyectado”,“categoria”:“fijos_vivienda”,“subcategoria”:“Servicios”,“detalle”:“Agua”,“monto”:50.0,“fecha”:“2026-10-30”,“persona”:“Sanat”,“grupoId”:“seedgrp_004”},{“id”:“seed_0027”,“tipo”:“gasto”,“tipoRegistro”:“proyectado”,“categoria”:“fijos_vivienda”,“subcategoria”:“Servicios”,“detalle”:“Agua”,“monto”:50.0,“fecha”:“2026-11-30”,“persona”:“Sanat”,“grupoId”:“seedgrp_004”},{“id”:“seed_0028”,“tipo”:“gasto”,“tipoRegistro”:“proyectado”,“categoria”:“fijos_vivienda”,“subcategoria”:“Servicios”,“detalle”:“Agua”,“monto”:50.0,“fecha”:“2026-12-30”,“persona”:“Sanat”,“grupoId”:“seedgrp_004”},{“id”:“seed_0029”,“tipo”:“gasto”,“tipoRegistro”:“proyectado”,“categoria”:“fijos_vivienda”,“subcategoria”:“Servicios”,“detalle”:“Agua”,“monto”:50.0,“fecha”:“2027-01-30”,“persona”:“Sanat”,“grupoId”:“seedgrp_004”},{“id”:“seed_0030”,“tipo”:“gasto”,“tipoRegistro”:“proyectado”,“categoria”:“fijos_vivienda”,“subcategoria”:“Servicios”,“detalle”:“Agua”,“monto”:50.0,“fecha”:“2027-02-28”,“persona”:“Sanat”,“grupoId”:“seedgrp_004”},{“id”:“seed_0031”,“tipo”:“gasto”,“tipoRegistro”:“proyectado”,“categoria”:“alimentacion”,“subcategoria”:“Comida Casa”,“detalle”:“Dinero”,“monto”:450.0,“fecha”:“2026-03-24”,“persona”:“Sanat”,“grupoId”:“seedgrp_005”},{“id”:“seed_0032”,“tipo”:“gasto”,“tipoRegistro”:“proyectado”,“categoria”:“alimentacion”,“subcategoria”:“Comida Casa”,“detalle”:“Dinero”,“monto”:450.0,“fecha”:“2026-04-24”,“persona”:“Sanat”,“grupoId”:“seedgrp_005”},{“id”:“seed_0033”,“tipo”:“gasto”,“tipoRegistro”:“proyectado”,“categoria”:“alimentacion”,“subcategoria”:“Comida Casa”,“detalle”:“Dinero”,“monto”:450.0,“fecha”:“2026-05-24”,“persona”:“Sanat”,“grupoId”:“seedgrp_005”},{“id”:“seed_0034”,“tipo”:“gasto”,“tipoRegistro”:“proyectado”,“categoria”:“alimentacion”,“subcategoria”:“Comida Casa”,“detalle”:“Dinero”,“monto”:450.0,“fecha”:“2026-06-24”,“persona”:“Sanat”,“grupoId”:“seedgrp_005”},{“id”:“seed_0035”,“tipo”:“gasto”,“tipoRegistro”:“proyectado”,“categoria”:“alimentacion”,“subcategoria”:“Comida Casa”,“detalle”:“Dinero”,“monto”:450.0,“fecha”:“2026-07-24”,“persona”:“Sanat”,“grupoId”:“seedgrp_005”},{“id”:“seed_0036”,“tipo”:“gasto”,“tipoRegistro”:“proyectado”,“categoria”:“alimentacion”,“subcategoria”:“Comida Casa”,“detalle”:“Dinero”,“monto”:450.0,“fecha”:“2026-08-24”,“persona”:“Sanat”,“grupoId”:“seedgrp_005”},{“id”:“seed_0037”,“tipo”:“gasto”,“tipoRegistro”:“proyectado”,“categoria”:“alimentacion”,“subcategoria”:“Comida Casa”,“detalle”:“Dinero”,“monto”:450.0,“fecha”:“2026-09-24”,“persona”:“Sanat”,“grupoId”:“seedgrp_005”},{“id”:“seed_0038”,“tipo”:“gasto”,“tipoRegistro”:“proyectado”,“categoria”:“alimentacion”,“subcategoria”:“Comida Casa”,“detalle”:“Dinero”,“monto”:450.0,“fecha”:“2026-10-24”,“persona”:“Sanat”,“grupoId”:“seedgrp_005”},{“id”:“seed_0039”,“tipo”:“gasto”,“tipoRegistro”:“proyectado”,“categoria”:“alimentacion”,“subcategoria”:“Comida Casa”,“detalle”:“Dinero”,“monto”:450.0,“fecha”:“2026-11-24”,“persona”:“Sanat”,“grupoId”:“seedgrp_005”},{“id”:“seed_0040”,“tipo”:“gasto”,“tipoRegistro”:“proyectado”,“categoria”:“alimentacion”,“subcategoria”:“Comida Casa”,“detalle”:“Dinero”,“monto”:450.0,“fecha”:“2026-12-24”,“persona”:“Sanat”,“grupoId”:“seedgrp_005”},{“id”:“seed_0041”,“tipo”:“gasto”,“tipoRegistro”:“proyectado”,“categoria”:“alimentacion”,“subcategoria”:“Comida Casa”,“detalle”:“Dinero”,“monto”:450.0,“fecha”:“2027-01-24”,“persona”:“Sanat”,“grupoId”:“seedgrp_005”},{“id”:“seed_0042”,“tipo”:“gasto”,“tipoRegistro”:“proyectado”,“categoria”:“alimentacion”,“subcategoria”:“Comida Casa”,“detalle”:“Dinero”,“monto”:450.0,“fecha”:“2027-02-24”,“persona”:“Sanat”,“grupoId”:“seedgrp_005”},{“id”:“seed_0043”,“tipo”:“gasto”,“tipoRegistro”:“real”,“categoria”:“casa_padres”,“subcategoria”:“Comida”,“detalle”:“Alimento”,“monto”:20.0,“fecha”:“2026-03-26”,“persona”:“Sanat”,“grupoId”:null},{“id”:“seed_0044”,“tipo”:“gasto”,“tipoRegistro”:“proyectado”,“categoria”:“ahorro”,“subcategoria”:“Ahorro Carro”,“detalle”:“Segunda Toyota”,“monto”:400.0,“fecha”:“2026-04-24”,“persona”:“Sanat”,“grupoId”:“seedgrp_006”},{“id”:“seed_0045”,“tipo”:“gasto”,“tipoRegistro”:“proyectado”,“categoria”:“ahorro”,“subcategoria”:“Ahorro Carro”,“detalle”:“Segunda Toyota”,“monto”:400.0,“fecha”:“2026-05-24”,“persona”:“Sanat”,“grupoId”:“seedgrp_006”},{“id”:“seed_0046”,“tipo”:“gasto”,“tipoRegistro”:“proyectado”,“categoria”:“ahorro”,“subcategoria”:“Ahorro Carro”,“detalle”:“Segunda Toyota”,“monto”:400.0,“fecha”:“2026-06-24”,“persona”:“Sanat”,“grupoId”:“seedgrp_006”},{“id”:“seed_0047”,“tipo”:“gasto”,“tipoRegistro”:“proyectado”,“categoria”:“ahorro”,“subcategoria”:“Ahorro Carro”,“detalle”:“Segunda Toyota”,“monto”:400.0,“fecha”:“2026-07-24”,“persona”:“Sanat”,“grupoId”:“seedgrp_006”},{“id”:“seed_0048”,“tipo”:“gasto”,“tipoRegistro”:“proyectado”,“categoria”:“ahorro”,“subcategoria”:“Ahorro Carro”,“detalle”:“Segunda Toyota”,“monto”:400.0,“fecha”:“2026-08-24”,“persona”:“Sanat”,“grupoId”:“seedgrp_006”},{“id”:“seed_0049”,“tipo”:“gasto”,“tipoRegistro”:“proyectado”,“categoria”:“ahorro”,“subcategoria”:“Ahorro Carro”,“detalle”:“Segunda Toyota”,“monto”:400.0,“fecha”:“2026-09-24”,“persona”:“Sanat”,“grupoId”:“seedgrp_006”},{“id”:“seed_0050”,“tipo”:“gasto”,“tipoRegistro”:“proyectado”,“categoria”:“ahorro”,“subcategoria”:“Ahorro Carro”,“detalle”:“Segunda Toyota”,“monto”:400.0,“fecha”:“2026-10-24”,“persona”:“Sanat”,“grupoId”:“seedgrp_006”},{“id”:“seed_0051”,“tipo”:“gasto”,“tipoRegistro”:“proyectado”,“categoria”:“ahorro”,“subcategoria”:“Ahorro Carro”,“detalle”:“Segunda Toyota”,“monto”:400.0,“fecha”:“2026-11-24”,“persona”:“Sanat”,“grupoId”:“seedgrp_006”},{“id”:“seed_0052”,“tipo”:“gasto”,“tipoRegistro”:“proyectado”,“categoria”:“ahorro”,“subcategoria”:“Ahorro Carro”,“detalle”:“Segunda Toyota”,“monto”:400.0,“fecha”:“2026-12-24”,“persona”:“Sanat”,“grupoId”:“seedgrp_006”},{“id”:“seed_0053”,“tipo”:“gasto”,“tipoRegistro”:“proyectado”,“categoria”:“ahorro”,“subcategoria”:“Ahorro Carro”,“detalle”:“Segunda Toyota”,“monto”:400.0,“fecha”:“2027-01-24”,“persona”:“Sanat”,“grupoId”:“seedgrp_006”},{“id”:“seed_0054”,“tipo”:“gasto”,“tipoRegistro”:“proyectado”,“categoria”:“ahorro”,“subcategoria”:“Ahorro Carro”,“detalle”:“Segunda Toyota”,“monto”:400.0,“fecha”:“2027-02-24”,“persona”:“Sanat”,“grupoId”:“seedgrp_006”},{“id”:“seed_0055”,“tipo”:“gasto”,“tipoRegistro”:“proyectado”,“categoria”:“ahorro”,“subcategoria”:“Ahorro Carro”,“detalle”:“Segunda Toyota”,“monto”:400.0,“fecha”:“2027-03-24”,“persona”:“Sanat”,“grupoId”:“seedgrp_006”},{“id”:“seed_0056”,“tipo”:“gasto”,“tipoRegistro”:“proyectado”,“categoria”:“inversion”,“subcategoria”:“Lovable”,“detalle”:””,“monto”:200.0,“fecha”:“2026-04-23”,“persona”:“Sanat”,“grupoId”:“seedgrp_007”},{“id”:“seed_0057”,“tipo”:“gasto”,“tipoRegistro”:“proyectado”,“categoria”:“inversion”,“subcategoria”:“Lovable”,“detalle”:””,“monto”:200.0,“fecha”:“2026-05-23”,“persona”:“Sanat”,“grupoId”:“seedgrp_007”},{“id”:“seed_0058”,“tipo”:“gasto”,“tipoRegistro”:“proyectado”,“categoria”:“inversion”,“subcategoria”:“Lovable”,“detalle”:””,“monto”:200.0,“fecha”:“2026-06-23”,“persona”:“Sanat”,“grupoId”:“seedgrp_007”},{“id”:“seed_0059”,“tipo”:“gasto”,“tipoRegistro”:“proyectado”,“categoria”:“inversion”,“subcategoria”:“Lovable”,“detalle”:””,“monto”:200.0,“fecha”:“2026-07-23”,“persona”:“Sanat”,“grupoId”:“seedgrp_007”},{“id”:“seed_0060”,“tipo”:“gasto”,“tipoRegistro”:“proyectado”,“categoria”:“inversion”,“subcategoria”:“Lovable”,“detalle”:””,“monto”:200.0,“fecha”:“2026-08-23”,“persona”:“Sanat”,“grupoId”:“seedgrp_007”},{“id”:“seed_0061”,“tipo”:“gasto”,“tipoRegistro”:“proyectado”,“categoria”:“inversion”,“subcategoria”:“Lovable”,“detalle”:””,“monto”:200.0,“fecha”:“2026-09-23”,“persona”:“Sanat”,“grupoId”:“seedgrp_007”},{“id”:“seed_0062”,“tipo”:“gasto”,“tipoRegistro”:“proyectado”,“categoria”:“inversion”,“subcategoria”:“Lovable”,“detalle”:””,“monto”:200.0,“fecha”:“2026-10-23”,“persona”:“Sanat”,“grupoId”:“seedgrp_007”},{“id”:“seed_0063”,“tipo”:“gasto”,“tipoRegistro”:“proyectado”,“categoria”:“inversion”,“subcategoria”:“Lovable”,“detalle”:””,“monto”:200.0,“fecha”:“2026-11-23”,“persona”:“Sanat”,“grupoId”:“seedgrp_007”},{“id”:“seed_0064”,“tipo”:“gasto”,“tipoRegistro”:“proyectado”,“categoria”:“inversion”,“subcategoria”:“Lovable”,“detalle”:””,“monto”:200.0,“fecha”:“2026-12-23”,“persona”:“Sanat”,“grupoId”:“seedgrp_007”},{“id”:“seed_0065”,“tipo”:“gasto”,“tipoRegistro”:“proyectado”,“categoria”:“inversion”,“subcategoria”:“Lovable”,“detalle”:””,“monto”:200.0,“fecha”:“2027-01-23”,“persona”:“Sanat”,“grupoId”:“seedgrp_007”},{“id”:“seed_0066”,“tipo”:“gasto”,“tipoRegistro”:“proyectado”,“categoria”:“inversion”,“subcategoria”:“Lovable”,“detalle”:””,“monto”:200.0,“fecha”:“2027-02-23”,“persona”:“Sanat”,“grupoId”:“seedgrp_007”},{“id”:“seed_0067”,“tipo”:“gasto”,“tipoRegistro”:“proyectado”,“categoria”:“inversion”,“subcategoria”:“Lovable”,“detalle”:””,“monto”:200.0,“fecha”:“2027-03-23”,“persona”:“Sanat”,“grupoId”:“seedgrp_007”},{“id”:“seed_0068”,“tipo”:“gasto”,“tipoRegistro”:“real”,“categoria”:“casa_padres”,“subcategoria”:“Servicios”,“detalle”:“Luz 654822”,“monto”:328.4,“fecha”:“2026-03-24”,“persona”:“Sanat”,“grupoId”:null},{“id”:“seed_0069”,“tipo”:“gasto”,“tipoRegistro”:“proyectado”,“categoria”:“casa_padres”,“subcategoria”:“Mamá”,“detalle”:“Luz 654822”,“monto”:300.0,“fecha”:“2026-03-23”,“persona”:“Sanat”,“grupoId”:“seedgrp_008”},{“id”:“seed_0070”,“tipo”:“gasto”,“tipoRegistro”:“proyectado”,“categoria”:“casa_padres”,“subcategoria”:“Mamá”,“detalle”:“Luz 654822”,“monto”:300.0,“fecha”:“2026-04-23”,“persona”:“Sanat”,“grupoId”:“seedgrp_008”},{“id”:“seed_0071”,“tipo”:“gasto”,“tipoRegistro”:“proyectado”,“categoria”:“casa_padres”,“subcategoria”:“Mamá”,“detalle”:“Luz 654822”,“monto”:300.0,“fecha”:“2026-05-23”,“persona”:“Sanat”,“grupoId”:“seedgrp_008”},{“id”:“seed_0072”,“tipo”:“gasto”,“tipoRegistro”:“proyectado”,“categoria”:“casa_padres”,“subcategoria”:“Mamá”,“detalle”:“Luz 654822”,“monto”:300.0,“fecha”:“2026-06-23”,“persona”:“Sanat”,“grupoId”:“seedgrp_008”},{“id”:“seed_0073”,“tipo”:“gasto”,“tipoRegistro”:“proyectado”,“categoria”:“casa_padres”,“subcategoria”:“Mamá”,“detalle”:“Luz 654822”,“monto”:300.0,“fecha”:“2026-07-23”,“persona”:“Sanat”,“grupoId”:“seedgrp_008”},{“id”:“seed_0074”,“tipo”:“gasto”,“tipoRegistro”:“proyectado”,“categoria”:“casa_padres”,“subcategoria”:“Mamá”,“detalle”:“Luz 654822”,“monto”:300.0,“fecha”:“2026-08-23”,“persona”:“Sanat”,“grupoId”:“seedgrp_008”},{“id”:“seed_0075”,“tipo”:“gasto”,“tipoRegistro”:“proyectado”,“categoria”:“casa_padres”,“subcategoria”:“Mamá”,“detalle”:“Luz 654822”,“monto”:300.0,“fecha”:“2026-09-23”,“persona”:“Sanat”,“grupoId”:“seedgrp_008”},{“id”:“seed_0076”,“tipo”:“gasto”,“tipoRegistro”:“proyectado”,“categoria”:“casa_padres”,“subcategoria”:“Mamá”,“detalle”:“Luz 654822”,“monto”:300.0,“fecha”:“2026-10-23”,“persona”:“Sanat”,“grupoId”:“seedgrp_008”},{“id”:“seed_0077”,“tipo”:“gasto”,“tipoRegistro”:“proyectado”,“categoria”:“casa_padres”,“subcategoria”:“Mamá”,“detalle”:“Luz 654822”,“monto”:300.0,“fecha”:“2026-11-23”,“persona”:“Sanat”,“grupoId”:“seedgrp_008”},{“id”:“seed_0078”,“tipo”:“gasto”,“tipoRegistro”:“proyectado”,“categoria”:“casa_padres”,“subcategoria”:“Mamá”,“detalle”:“Luz 654822”,“monto”:300.0,“fecha”:“2026-12-23”,“persona”:“Sanat”,“grupoId”:“seedgrp_008”},{“id”:“seed_0079”,“tipo”:“gasto”,“tipoRegistro”:“proyectado”,“categoria”:“casa_padres”,“subcategoria”:“Mamá”,“detalle”:“Luz 654822”,“monto”:300.0,“fecha”:“2027-01-23”,“persona”:“Sanat”,“grupoId”:“seedgrp_008”},{“id”:“seed_0080”,“tipo”:“gasto”,“tipoRegistro”:“proyectado”,“categoria”:“casa_padres”,“subcategoria”:“Mamá”,“detalle”:“Luz 654822”,“monto”:300.0,“fecha”:“2027-02-23”,“persona”:“Sanat”,“grupoId”:“seedgrp_008”},{“id”:“seed_0081”,“tipo”:“gasto”,“tipoRegistro”:“proyectado”,“categoria”:“transporte”,“subcategoria”:“Varios”,“detalle”:“Bus/Tren/Taxi”,“monto”:200.0,“fecha”:“2026-03-23”,“persona”:“Sanat”,“grupoId”:“seedgrp_009”},{“id”:“seed_0082”,“tipo”:“gasto”,“tipoRegistro”:“proyectado”,“categoria”:“transporte”,“subcategoria”:“Varios”,“detalle”:“Bus/Tren/Taxi”,“monto”:200.0,“fecha”:“2026-04-23”,“persona”:“Sanat”,“grupoId”:“seedgrp_009”},{“id”:“seed_0083”,“tipo”:“gasto”,“tipoRegistro”:“proyectado”,“categoria”:“transporte”,“subcategoria”:“Varios”,“detalle”:“Bus/Tren/Taxi”,“monto”:200.0,“fecha”:“2026-05-23”,“persona”:“Sanat”,“grupoId”:“seedgrp_009”},{“id”:“seed_0084”,“tipo”:“gasto”,“tipoRegistro”:“proyectado”,“categoria”:“transporte”,“subcategoria”:“Varios”,“detalle”:“Bus/Tren/Taxi”,“monto”:200.0,“fecha”:“2026-06-23”,“persona”:“Sanat”,“grupoId”:“seedgrp_009”},{“id”:“seed_0085”,“tipo”:“gasto”,“tipoRegistro”:“proyectado”,“categoria”:“transporte”,“subcategoria”:“Varios”,“detalle”:“Bus/Tren/Taxi”,“monto”:200.0,“fecha”:“2026-07-23”,“persona”:“Sanat”,“grupoId”:“seedgrp_009”},{“id”:“seed_0086”,“tipo”:“gasto”,“tipoRegistro”:“proyectado”,“categoria”:“transporte”,“subcategoria”:“Varios”,“detalle”:“Bus/Tren/Taxi”,“monto”:200.0,“fecha”:“2026-08-23”,“persona”:“Sanat”,“grupoId”:“seedgrp_009”},{“id”:“seed_0087”,“tipo”:“gasto”,“tipoRegistro”:“proyectado”,“categoria”:“transporte”,“subcategoria”:“Varios”,“detalle”:“Bus/Tren/Taxi”,“monto”:200.0,“fecha”:“2026-09-23”,“persona”:“Sanat”,“grupoId”:“seedgrp_009”},{“id”:“seed_0088”,“tipo”:“gasto”,“tipoRegistro”:“proyectado”,“categoria”:“transporte”,“subcategoria”:“Varios”,“detalle”:“Bus/Tren/Taxi”,“monto”:200.0,“fecha”:“2026-10-23”,“persona”:“Sanat”,“grupoId”:“seedgrp_009”},{“id”:“seed_0089”,“tipo”:“gasto”,“tipoRegistro”:“proyectado”,“categoria”:“transporte”,“subcategoria”:“Varios”,“detalle”:“Bus/Tren/Taxi”,“monto”:200.0,“fecha”:“2026-11-23”,“persona”:“Sanat”,“grupoId”:“seedgrp_009”},{“id”:“seed_0090”,“tipo”:“gasto”,“tipoRegistro”:“proyectado”,“categoria”:“transporte”,“subcategoria”:“Varios”,“detalle”:“Bus/Tren/Taxi”,“monto”:200.0,“fecha”:“2026-12-23”,“persona”:“Sanat”,“grupoId”:“seedgrp_009”},{“id”:“seed_0091”,“tipo”:“gasto”,“tipoRegistro”:“proyectado”,“categoria”:“transporte”,“subcategoria”:“Varios”,“detalle”:“Bus/Tren/Taxi”,“monto”:200.0,“fecha”:“2027-01-23”,“persona”:“Sanat”,“grupoId”:“seedgrp_009”},{“id”:“seed_0092”,“tipo”:“gasto”,“tipoRegistro”:“proyectado”,“categoria”:“transporte”,“subcategoria”:“Varios”,“detalle”:“Bus/Tren/Taxi”,“monto”:200.0,“fecha”:“2027-02-23”,“persona”:“Sanat”,“grupoId”:“seedgrp_009”},{“id”:“seed_0093”,“tipo”:“gasto”,“tipoRegistro”:“real”,“categoria”:“alimentacion”,“subcategoria”:“Comida Casa”,“detalle”:“Dinero”,“monto”:450.0,“fecha”:“2026-03-24”,“persona”:“Sanat”,“grupoId”:null},{“id”:“seed_0094”,“tipo”:“gasto”,“tipoRegistro”:“proyectado”,“categoria”:“otros”,“subcategoria”:“Salida Familiar”,“detalle”:””,“monto”:200.0,“fecha”:“2026-03-23”,“persona”:“Sanat”,“grupoId”:“seedgrp_010”},{“id”:“seed_0095”,“tipo”:“gasto”,“tipoRegistro”:“proyectado”,“categoria”:“otros”,“subcategoria”:“Salida Familiar”,“detalle”:””,“monto”:200.0,“fecha”:“2026-04-23”,“persona”:“Sanat”,“grupoId”:“seedgrp_010”},{“id”:“seed_0096”,“tipo”:“gasto”,“tipoRegistro”:“proyectado”,“categoria”:“otros”,“subcategoria”:“Salida Familiar”,“detalle”:””,“monto”:200.0,“fecha”:“2026-05-23”,“persona”:“Sanat”,“grupoId”:“seedgrp_010”},{“id”:“seed_0097”,“tipo”:“gasto”,“tipoRegistro”:“proyectado”,“categoria”:“otros”,“subcategoria”:“Salida Familiar”,“detalle”:””,“monto”:200.0,“fecha”:“2026-06-23”,“persona”:“Sanat”,“grupoId”:“seedgrp_010”},{“id”:“seed_0098”,“tipo”:“gasto”,“tipoRegistro”:“proyectado”,“categoria”:“otros”,“subcategoria”:“Salida Familiar”,“detalle”:””,“monto”:200.0,“fecha”:“2026-07-23”,“persona”:“Sanat”,“grupoId”:“seedgrp_010”},{“id”:“seed_0099”,“tipo”:“gasto”,“tipoRegistro”:“proyectado”,“categoria”:“otros”,“subcategoria”:“Salida Familiar”,“detalle”:””,“monto”:200.0,“fecha”:“2026-08-23”,“persona”:“Sanat”,“grupoId”:“seedgrp_010”},{“id”:“seed_0100”,“tipo”:“gasto”,“tipoRegistro”:“proyectado”,“categoria”:“otros”,“subcategoria”:“Salida Familiar”,“detalle”:””,“monto”:200.0,“fecha”:“2026-09-23”,“persona”:“Sanat”,“grupoId”:“seedgrp_010”},{“id”:“seed_0101”,“tipo”:“gasto”,“tipoRegistro”:“proyectado”,“categoria”:“otros”,“subcategoria”:“Salida Familiar”,“detalle”:””,“monto”:200.0,“fecha”:“2026-10-23”,“persona”:“Sanat”,“grupoId”:“seedgrp_010”},{“id”:“seed_0102”,“tipo”:“gasto”,“tipoRegistro”:“proyectado”,“categoria”:“otros”,“subcategoria”:“Salida Familiar”,“detalle”:””,“monto”:200.0,“fecha”:“2026-11-23”,“persona”:“Sanat”,“grupoId”:“seedgrp_010”},{“id”:“seed_0103”,“tipo”:“gasto”,“tipoRegistro”:“proyectado”,“categoria”:“otros”,“subcategoria”:“Salida Familiar”,“detalle”:””,“monto”:200.0,“fecha”:“2026-12-23”,“persona”:“Sanat”,“grupoId”:“seedgrp_010”},{“id”:“seed_0104”,“tipo”:“gasto”,“tipoRegistro”:“proyectado”,“categoria”:“otros”,“subcategoria”:“Salida Familiar”,“detalle”:””,“monto”:200.0,“fecha”:“2027-01-23”,“persona”:“Sanat”,“grupoId”:“seedgrp_010”},{“id”:“seed_0105”,“tipo”:“gasto”,“tipoRegistro”:“proyectado”,“categoria”:“otros”,“subcategoria”:“Salida Familiar”,“detalle”:””,“monto”:200.0,“fecha”:“2027-02-23”,“persona”:“Sanat”,“grupoId”:“seedgrp_010”},{“id”:“seed_0106”,“tipo”:“gasto”,“tipoRegistro”:“real”,“categoria”:“fijos_vivienda”,“subcategoria”:“Servicios”,“detalle”:“Agua”,“monto”:60.0,“fecha”:“2026-04-08”,“persona”:“Sanat”,“grupoId”:null},{“id”:“seed_0107”,“tipo”:“gasto”,“tipoRegistro”:“proyectado”,“categoria”:“casa_padres”,“subcategoria”:“Comida”,“detalle”:“Alimento”,“monto”:60.0,“fecha”:“2026-03-25”,“persona”:“Sanat”,“grupoId”:“seedgrp_011”},{“id”:“seed_0108”,“tipo”:“gasto”,“tipoRegistro”:“proyectado”,“categoria”:“casa_padres”,“subcategoria”:“Comida”,“detalle”:“Alimento”,“monto”:60.0,“fecha”:“2026-04-25”,“persona”:“Sanat”,“grupoId”:“seedgrp_011”},{“id”:“seed_0109”,“tipo”:“gasto”,“tipoRegistro”:“proyectado”,“categoria”:“casa_padres”,“subcategoria”:“Comida”,“detalle”:“Alimento”,“monto”:60.0,“fecha”:“2026-05-25”,“persona”:“Sanat”,“grupoId”:“seedgrp_011”},{“id”:“seed_0110”,“tipo”:“gasto”,“tipoRegistro”:“proyectado”,“categoria”:“casa_padres”,“subcategoria”:“Comida”,“detalle”:“Alimento”,“monto”:60.0,“fecha”:“2026-06-25”,“persona”:“Sanat”,“grupoId”:“seedgrp_011”},{“id”:“seed_0111”,“tipo”:“gasto”,“tipoRegistro”:“proyectado”,“categoria”:“casa_padres”,“subcategoria”:“Comida”,“detalle”:“Alimento”,“monto”:60.0,“fecha”:“2026-07-25”,“persona”:“Sanat”,“grupoId”:“seedgrp_011”},{“id”:“seed_0112”,“tipo”:“gasto”,“tipoRegistro”:“proyectado”,“categoria”:“casa_padres”,“subcategoria”:“Comida”,“detalle”:“Alimento”,“monto”:60.0,“fecha”:“2026-08-25”,“persona”:“Sanat”,“grupoId”:“seedgrp_011”},{“id”:“seed_0113”,“tipo”:“gasto”,“tipoRegistro”:“proyectado”,“categoria”:“casa_padres”,“subcategoria”:“Comida”,“detalle”:“Alimento”,“monto”:60.0,“fecha”:“2026-09-25”,“persona”:“Sanat”,“grupoId”:“seedgrp_011”},{“id”:“seed_0114”,“tipo”:“gasto”,“tipoRegistro”:“proyectado”,“categoria”:“casa_padres”,“subcategoria”:“Comida”,“detalle”:“Alimento”,“monto”:60.0,“fecha”:“2026-10-25”,“persona”:“Sanat”,“grupoId”:“seedgrp_011”},{“id”:“seed_0115”,“tipo”:“gasto”,“tipoRegistro”:“proyectado”,“categoria”:“casa_padres”,“subcategoria”:“Comida”,“detalle”:“Alimento”,“monto”:60.0,“fecha”:“2026-11-25”,“persona”:“Sanat”,“grupoId”:“seedgrp_011”},{“id”:“seed_0116”,“tipo”:“gasto”,“tipoRegistro”:“proyectado”,“categoria”:“casa_padres”,“subcategoria”:“Comida”,“detalle”:“Alimento”,“monto”:60.0,“fecha”:“2026-12-25”,“persona”:“Sanat”,“grupoId”:“seedgrp_011”},{“id”:“seed_0117”,“tipo”:“gasto”,“tipoRegistro”:“proyectado”,“categoria”:“casa_padres”,“subcategoria”:“Comida”,“detalle”:“Alimento”,“monto”:60.0,“fecha”:“2027-01-25”,“persona”:“Sanat”,“grupoId”:“seedgrp_011”},{“id”:“seed_0118”,“tipo”:“gasto”,“tipoRegistro”:“proyectado”,“categoria”:“casa_padres”,“subcategoria”:“Comida”,“detalle”:“Alimento”,“monto”:60.0,“fecha”:“2027-02-25”,“persona”:“Sanat”,“grupoId”:“seedgrp_011”},{“id”:“seed_0119”,“tipo”:“gasto”,“tipoRegistro”:“proyectado”,“categoria”:“fijos_vivienda”,“subcategoria”:“Servicios”,“detalle”:“Internet”,“monto”:60.0,“fecha”:“2026-04-10”,“persona”:“Sanat”,“grupoId”:“seedgrp_012”},{“id”:“seed_0120”,“tipo”:“gasto”,“tipoRegistro”:“proyectado”,“categoria”:“fijos_vivienda”,“subcategoria”:“Servicios”,“detalle”:“Internet”,“monto”:60.0,“fecha”:“2026-05-10”,“persona”:“Sanat”,“grupoId”:“seedgrp_012”},{“id”:“seed_0121”,“tipo”:“gasto”,“tipoRegistro”:“proyectado”,“categoria”:“fijos_vivienda”,“subcategoria”:“Servicios”,“detalle”:“Internet”,“monto”:60.0,“fecha”:“2026-06-10”,“persona”:“Sanat”,“grupoId”:“seedgrp_012”},{“id”:“seed_0122”,“tipo”:“gasto”,“tipoRegistro”:“proyectado”,“categoria”:“fijos_vivienda”,“subcategoria”:“Servicios”,“detalle”:“Internet”,“monto”:60.0,“fecha”:“2026-07-10”,“persona”:“Sanat”,“grupoId”:“seedgrp_012”},{“id”:“seed_0123”,“tipo”:“gasto”,“tipoRegistro”:“proyectado”,“categoria”:“fijos_vivienda”,“subcategoria”:“Servicios”,“detalle”:“Internet”,“monto”:60.0,“fecha”:“2026-08-10”,“persona”:“Sanat”,“grupoId”:“seedgrp_012”},{“id”:“seed_0124”,“tipo”:“gasto”,“tipoRegistro”:“proyectado”,“categoria”:“fijos_vivienda”,“subcategoria”:“Servicios”,“detalle”:“Internet”,“monto”:60.0,“fecha”:“2026-09-10”,“persona”:“Sanat”,“grupoId”:“seedgrp_012”},{“id”:“seed_0125”,“tipo”:“gasto”,“tipoRegistro”:“proyectado”,“categoria”:“fijos_vivienda”,“subcategoria”:“Servicios”,“detalle”:“Internet”,“monto”:60.0,“fecha”:“2026-10-10”,“persona”:“Sanat”,“grupoId”:“seedgrp_012”},{“id”:“seed_0126”,“tipo”:“gasto”,“tipoRegistro”:“proyectado”,“categoria”:“fijos_vivienda”,“subcategoria”:“Servicios”,“detalle”:“Internet”,“monto”:60.0,“fecha”:“2026-11-10”,“persona”:“Sanat”,“grupoId”:“seedgrp_012”},{“id”:“seed_0127”,“tipo”:“gasto”,“tipoRegistro”:“proyectado”,“categoria”:“fijos_vivienda”,“subcategoria”:“Servicios”,“detalle”:“Internet”,“monto”:60.0,“fecha”:“2026-12-10”,“persona”:“Sanat”,“grupoId”:“seedgrp_012”},{“id”:“seed_0128”,“tipo”:“gasto”,“tipoRegistro”:“proyectado”,“categoria”:“fijos_vivienda”,“subcategoria”:“Servicios”,“detalle”:“Internet”,“monto”:60.0,“fecha”:“2027-01-10”,“persona”:“Sanat”,“grupoId”:“seedgrp_012”},{“id”:“seed_0129”,“tipo”:“gasto”,“tipoRegistro”:“proyectado”,“categoria”:“fijos_vivienda”,“subcategoria”:“Servicios”,“detalle”:“Internet”,“monto”:60.0,“fecha”:“2027-02-10”,“persona”:“Sanat”,“grupoId”:“seedgrp_012”},{“id”:“seed_0130”,“tipo”:“gasto”,“tipoRegistro”:“proyectado”,“categoria”:“fijos_vivienda”,“subcategoria”:“Servicios”,“detalle”:“Internet”,“monto”:60.0,“fecha”:“2027-03-10”,“persona”:“Sanat”,“grupoId”:“seedgrp_012”},{“id”:“seed_0131”,“tipo”:“gasto”,“tipoRegistro”:“proyectado”,“categoria”:“fijos_vivienda”,“subcategoria”:“Servicios”,“detalle”:“Luz”,“monto”:90.0,“fecha”:“2026-03-30”,“persona”:“Sanat”,“grupoId”:“seedgrp_013”},{“id”:“seed_0132”,“tipo”:“gasto”,“tipoRegistro”:“proyectado”,“categoria”:“fijos_vivienda”,“subcategoria”:“Servicios”,“detalle”:“Luz”,“monto”:90.0,“fecha”:“2026-04-30”,“persona”:“Sanat”,“grupoId”:“seedgrp_013”},{“id”:“seed_0133”,“tipo”:“gasto”,“tipoRegistro”:“proyectado”,“categoria”:“fijos_vivienda”,“subcategoria”:“Servicios”,“detalle”:“Luz”,“monto”:90.0,“fecha”:“2026-05-30”,“persona”:“Sanat”,“grupoId”:“seedgrp_013”},{“id”:“seed_0134”,“tipo”:“gasto”,“tipoRegistro”:“proyectado”,“categoria”:“fijos_vivienda”,“subcategoria”:“Servicios”,“detalle”:“Luz”,“monto”:90.0,“fecha”:“2026-06-30”,“persona”:“Sanat”,“grupoId”:“seedgrp_013”},{“id”:“seed_0135”,“tipo”:“gasto”,“tipoRegistro”:“proyectado”,“categoria”:“fijos_vivienda”,“subcategoria”:“Servicios”,“detalle”:“Luz”,“monto”:90.0,“fecha”:“2026-07-30”,“persona”:“Sanat”,“grupoId”:“seedgrp_013”},{“id”:“seed_0136”,“tipo”:“gasto”,“tipoRegistro”:“proyectado”,“categoria”:“fijos_vivienda”,“subcategoria”:“Servicios”,“detalle”:“Luz”,“monto”:90.0,“fecha”:“2026-08-30”,“persona”:“Sanat”,“grupoId”:“seedgrp_013”},{“id”:“seed_0137”,“tipo”:“gasto”,“tipoRegistro”:“proyectado”,“categoria”:“fijos_vivienda”,“subcategoria”:“Servicios”,“detalle”:“Luz”,“monto”:90.0,“fecha”:“2026-09-30”,“persona”:“Sanat”,“grupoId”:“seedgrp_013”},{“id”:“seed_0138”,“tipo”:“gasto”,“tipoRegistro”:“proyectado”,“categoria”:“fijos_vivienda”,“subcategoria”:“Servicios”,“detalle”:“Luz”,“monto”:90.0,“fecha”:“2026-10-30”,“persona”:“Sanat”,“grupoId”:“seedgrp_013”},{“id”:“seed_0139”,“tipo”:“gasto”,“tipoRegistro”:“proyectado”,“categoria”:“fijos_vivienda”,“subcategoria”:“Servicios”,“detalle”:“Luz”,“monto”:90.0,“fecha”:“2026-11-30”,“persona”:“Sanat”,“grupoId”:“seedgrp_013”},{“id”:“seed_0140”,“tipo”:“gasto”,“tipoRegistro”:“proyectado”,“categoria”:“fijos_vivienda”,“subcategoria”:“Servicios”,“detalle”:“Luz”,“monto”:90.0,“fecha”:“2026-12-30”,“persona”:“Sanat”,“grupoId”:“seedgrp_013”},{“id”:“seed_0141”,“tipo”:“gasto”,“tipoRegistro”:“proyectado”,“categoria”:“fijos_vivienda”,“subcategoria”:“Servicios”,“detalle”:“Luz”,“monto”:90.0,“fecha”:“2027-01-30”,“persona”:“Sanat”,“grupoId”:“seedgrp_013”},{“id”:“seed_0142”,“tipo”:“gasto”,“tipoRegistro”:“proyectado”,“categoria”:“fijos_vivienda”,“subcategoria”:“Servicios”,“detalle”:“Luz”,“monto”:90.0,“fecha”:“2027-02-28”,“persona”:“Sanat”,“grupoId”:“seedgrp_013”},{“id”:“seed_0143”,“tipo”:“gasto”,“tipoRegistro”:“proyectado”,“categoria”:“transporte”,“subcategoria”:“Trabajo”,“detalle”:“Bus/Tren”,“monto”:50.0,“fecha”:“2026-03-23”,“persona”:“Sanat”,“grupoId”:“seedgrp_014”},{“id”:“seed_0144”,“tipo”:“gasto”,“tipoRegistro”:“proyectado”,“categoria”:“transporte”,“subcategoria”:“Trabajo”,“detalle”:“Bus/Tren”,“monto”:50.0,“fecha”:“2026-04-23”,“persona”:“Sanat”,“grupoId”:“seedgrp_014”},{“id”:“seed_0145”,“tipo”:“gasto”,“tipoRegistro”:“proyectado”,“categoria”:“transporte”,“subcategoria”:“Trabajo”,“detalle”:“Bus/Tren”,“monto”:50.0,“fecha”:“2026-05-23”,“persona”:“Sanat”,“grupoId”:“seedgrp_014”},{“id”:“seed_0146”,“tipo”:“gasto”,“tipoRegistro”:“proyectado”,“categoria”:“transporte”,“subcategoria”:“Trabajo”,“detalle”:“Bus/Tren”,“monto”:50.0,“fecha”:“2026-06-23”,“persona”:“Sanat”,“grupoId”:“seedgrp_014”},{“id”:“seed_0147”,“tipo”:“gasto”,“tipoRegistro”:“proyectado”,“categoria”:“transporte”,“subcategoria”:“Trabajo”,“detalle”:“Bus/Tren”,“monto”:50.0,“fecha”:“2026-07-23”,“persona”:“Sanat”,“grupoId”:“seedgrp_014”},{“id”:“seed_0148”,“tipo”:“gasto”,“tipoRegistro”:“proyectado”,“categoria”:“transporte”,“subcategoria”:“Trabajo”,“detalle”:“Bus/Tren”,“monto”:50.0,“fecha”:“2026-08-23”,“persona”:“Sanat”,“grupoId”:“seedgrp_014”},{“id”:“seed_0149”,“tipo”:“gasto”,“tipoRegistro”:“proyectado”,“categoria”:“transporte”,“subcategoria”:“Trabajo”,“detalle”:“Bus/Tren”,“monto”:50.0,“fecha”:“2026-09-23”,“persona”:“Sanat”,“grupoId”:“seedgrp_014”},{“id”:“seed_0150”,“tipo”:“gasto”,“tipoRegistro”:“proyectado”,“categoria”:“transporte”,“subcategoria”:“Trabajo”,“detalle”:“Bus/Tren”,“monto”:50.0,“fecha”:“2026-10-23”,“persona”:“Sanat”,“grupoId”:“seedgrp_014”},{“id”:“seed_0151”,“tipo”:“gasto”,“tipoRegistro”:“proyectado”,“categoria”:“transporte”,“subcategoria”:“Trabajo”,“detalle”:“Bus/Tren”,“monto”:50.0,“fecha”:“2026-11-23”,“persona”:“Sanat”,“grupoId”:“seedgrp_014”},{“id”:“seed_0152”,“tipo”:“gasto”,“tipoRegistro”:“proyectado”,“categoria”:“transporte”,“subcategoria”:“Trabajo”,“detalle”:“Bus/Tren”,“monto”:50.0,“fecha”:“2026-12-23”,“persona”:“Sanat”,“grupoId”:“seedgrp_014”},{“id”:“seed_0153”,“tipo”:“gasto”,“tipoRegistro”:“proyectado”,“categoria”:“transporte”,“subcategoria”:“Trabajo”,“detalle”:“Bus/Tren”,“monto”:50.0,“fecha”:“2027-01-23”,“persona”:“Sanat”,“grupoId”:“seedgrp_014”},{“id”:“seed_0154”,“tipo”:“gasto”,“tipoRegistro”:“proyectado”,“categoria”:“transporte”,“subcategoria”:“Trabajo”,“detalle”:“Bus/Tren”,“monto”:50.0,“fecha”:“2027-02-23”,“persona”:“Sanat”,“grupoId”:“seedgrp_014”},{“id”:“seed_0155”,“tipo”:“gasto”,“tipoRegistro”:“real”,“categoria”:“otros”,“subcategoria”:“Comida”,“detalle”:“Pizza”,“monto”:41.0,“fecha”:“2026-03-23”,“persona”:“Sanat”,“grupoId”:null},{“id”:“seed_0156”,“tipo”:“gasto”,“tipoRegistro”:“real”,“categoria”:“deuda”,“subcategoria”:“Deuda a Giuli”,“detalle”:“prestamo”,“monto”:210.0,“fecha”:“2026-03-23”,“persona”:“Sanat”,“grupoId”:null},{“id”:“seed_0157”,“tipo”:“gasto”,“tipoRegistro”:“proyectado”,“categoria”:“deuda”,“subcategoria”:“Deuda a Giuli”,“detalle”:“prestamo”,“monto”:210.0,“fecha”:“2026-03-23”,“persona”:“Sanat”,“grupoId”:null},{“id”:“seed_0158”,“tipo”:“gasto”,“tipoRegistro”:“real”,“categoria”:“transporte”,“subcategoria”:“Varios”,“detalle”:“Bus/Tren/Taxi”,“monto”:12.5,“fecha”:“2026-03-26”,“persona”:“Sanat”,“grupoId”:null},{“id”:“seed_0159”,“tipo”:“gasto”,“tipoRegistro”:“proyectado”,“categoria”:“salud”,“subcategoria”:“Skincare”,“detalle”:””,“monto”:50.0,“fecha”:“2026-04-23”,“persona”:“Sanat”,“grupoId”:null},{“id”:“seed_0160”,“tipo”:“gasto”,“tipoRegistro”:“real”,“categoria”:“salud”,“subcategoria”:“Peluqueria”,“detalle”:””,“monto”:15.0,“fecha”:“2026-03-26”,“persona”:“Sanat”,“grupoId”:null},{“id”:“seed_0161”,“tipo”:“gasto”,“tipoRegistro”:“proyectado”,“categoria”:“salud”,“subcategoria”:“Peluqueria”,“detalle”:””,“monto”:50.0,“fecha”:“2026-03-23”,“persona”:“Sanat”,“grupoId”:null},{“id”:“seed_0162”,“tipo”:“gasto”,“tipoRegistro”:“proyectado”,“categoria”:“ahorro”,“subcategoria”:“Ahorro / Emergencias”,“detalle”:””,“monto”:0.0,“fecha”:“2026-03-24”,“persona”:“Sanat”,“grupoId”:null},{“id”:“seed_0163”,“tipo”:“gasto”,“tipoRegistro”:“proyectado”,“categoria”:“aseo_personal”,“subcategoria”:“Aseo Personal”,“detalle”:“Desodorante, etc”,“monto”:50.0,“fecha”:“2026-03-28”,“persona”:“Sanat”,“grupoId”:null},{“id”:“seed_0164”,“tipo”:“gasto”,“tipoRegistro”:“proyectado”,“categoria”:“mascota”,“subcategoria”:“Gata”,“detalle”:“Flora”,“monto”:50.0,“fecha”:“2026-03-26”,“persona”:“Sanat”,“grupoId”:null},{“id”:“seed_0165”,“tipo”:“gasto”,“tipoRegistro”:“proyectado”,“categoria”:“cumpleanos”,“subcategoria”:“Cumpleaños”,“detalle”:“Regalos :)”,“monto”:50.0,“fecha”:“2026-03-25”,“persona”:“Sanat”,“grupoId”:null},{“id”:“seed_0166”,“tipo”:“gasto”,“tipoRegistro”:“real”,“categoria”:“fijos_vivienda”,“subcategoria”:“Servicios”,“detalle”:“Luz”,“monto”:101.0,“fecha”:“2026-04-08”,“persona”:“Sanat”,“grupoId”:null},{“id”:“seed_0167”,“tipo”:“gasto”,“tipoRegistro”:“proyectado”,“categoria”:“servicios_digitales”,“subcategoria”:“Plan Móvil”,“detalle”:“Entel”,“monto”:40.0,“fecha”:“2026-04-06”,“persona”:“Sanat”,“grupoId”:null},{“id”:“seed_0168”,“tipo”:“gasto”,“tipoRegistro”:“real”,“categoria”:“otros”,“subcategoria”:“Salida Familiar”,“detalle”:””,“monto”:100.0,“fecha”:“2026-03-26”,“persona”:“Sanat”,“grupoId”:null},{“id”:“seed_0169”,“tipo”:“gasto”,“tipoRegistro”:“proyectado”,“categoria”:“inversion”,“subcategoria”:“ChatGPT”,“detalle”:””,“monto”:23.0,“fecha”:“2026-03-30”,“persona”:“Sanat”,“grupoId”:null},{“id”:“seed_0170”,“tipo”:“gasto”,“tipoRegistro”:“real”,“categoria”:“aseo_personal”,“subcategoria”:“Aseo Personal”,“detalle”:“Desodorante, etc”,“monto”:46.5,“fecha”:“2026-04-04”,“persona”:“Sanat”,“grupoId”:null},{“id”:“seed_0171”,“tipo”:“gasto”,“tipoRegistro”:“proyectado”,“categoria”:“fijos_vivienda”,“subcategoria”:“Alquiler”,“detalle”:“Minidepa”,“monto”:550.0,“fecha”:“2026-03-27”,“persona”:“Sanat”,“grupoId”:null},{“id”:“seed_0172”,“tipo”:“gasto”,“tipoRegistro”:“real”,“categoria”:“fijos_vivienda”,“subcategoria”:“Alquiler”,“detalle”:“Minidepa”,“monto”:550.0,“fecha”:“2026-03-28”,“persona”:“Sanat”,“grupoId”:null},{“id”:“seed_0173”,“tipo”:“gasto”,“tipoRegistro”:“real”,“categoria”:“mascota”,“subcategoria”:“Gata”,“detalle”:“Flora”,“monto”:40.0,“fecha”:“2026-04-04”,“persona”:“Sanat”,“grupoId”:null},{“id”:“seed_0174”,“tipo”:“gasto”,“tipoRegistro”:“proyectado”,“categoria”:“servicios_digitales”,“subcategoria”:“Spotify”,“detalle”:“Música”,“monto”:21.0,“fecha”:“2026-03-20”,“persona”:“Sanat”,“grupoId”:null},{“id”:“seed_0175”,“tipo”:“gasto”,“tipoRegistro”:“real”,“categoria”:“otros”,“subcategoria”:“Salida Familiar”,“detalle”:””,“monto”:84.29,“fecha”:“2026-04-04”,“persona”:“Sanat”,“grupoId”:null},{“id”:“seed_0176”,“tipo”:“gasto”,“tipoRegistro”:“real”,“categoria”:“inversion”,“subcategoria”:“ChatGPT”,“detalle”:””,“monto”:23.0,“fecha”:“2026-04-04”,“persona”:“Sanat”,“grupoId”:null},{“id”:“seed_0177”,“tipo”:“gasto”,“tipoRegistro”:“proyectado”,“categoria”:“servicios_digitales”,“subcategoria”:“Google One”,“detalle”:“Almacenamiento”,“monto”:13.0,“fecha”:“2026-04-21”,“persona”:“Sanat”,“grupoId”:null},{“id”:“seed_0178”,“tipo”:“gasto”,“tipoRegistro”:“real”,“categoria”:“transporte”,“subcategoria”:“Varios”,“detalle”:“Bus/Tren/Taxi”,“monto”:133.0,“fecha”:“2026-04-04”,“persona”:“Sanat”,“grupoId”:null},{“id”:“seed_0179”,“tipo”:“gasto”,“tipoRegistro”:“real”,“categoria”:“transporte”,“subcategoria”:“Varios”,“detalle”:“Bus/Tren/Taxi”,“monto”:26.5,“fecha”:“2026-04-05”,“persona”:“Sanat”,“grupoId”:null},{“id”:“seed_0180”,“tipo”:“gasto”,“tipoRegistro”:“real”,“categoria”:“otros”,“subcategoria”:“Varios”,“detalle”:””,“monto”:126.0,“fecha”:“2026-04-05”,“persona”:“Sanat”,“grupoId”:null},{“id”:“seed_0181”,“tipo”:“gasto”,“tipoRegistro”:“proyectado”,“categoria”:“fijos_vivienda”,“subcategoria”:“Aseo de Casa”,“detalle”:””,“monto”:50.0,“fecha”:“2026-03-25”,“persona”:“Sanat”,“grupoId”:null},{“id”:“seed_0182”,“tipo”:“gasto”,“tipoRegistro”:“real”,“categoria”:“fijos_vivienda”,“subcategoria”:“Aseo de Casa”,“detalle”:””,“monto”:19.9,“fecha”:“2026-04-04”,“persona”:“Sanat”,“grupoId”:null},{“id”:“seed_0183”,“tipo”:“gasto”,“tipoRegistro”:“real”,“categoria”:“fijos_vivienda”,“subcategoria”:“Servicios”,“detalle”:“Internet”,“monto”:60.0,“fecha”:“2026-04-08”,“persona”:“Sanat”,“grupoId”:null},{“id”:“seed_0184”,“tipo”:“gasto”,“tipoRegistro”:“real”,“categoria”:“servicios_digitales”,“subcategoria”:“Plan Móvil”,“detalle”:“Entel”,“monto”:40.0,“fecha”:“2026-04-12”,“persona”:“Sanat”,“grupoId”:null},{“id”:“seed_0185”,“tipo”:“gasto”,“tipoRegistro”:“real”,“categoria”:“transporte”,“subcategoria”:“Varios”,“detalle”:“Bus/Tren/Taxi”,“monto”:66.5,“fecha”:“2026-04-12”,“persona”:“Sanat”,“grupoId”:null},{“id”:“seed_0186”,“tipo”:“gasto”,“tipoRegistro”:“proyectado”,“categoria”:“inversion”,“subcategoria”:“Claude”,“detalle”:””,“monto”:74.8,“fecha”:“2026-04-21”,“persona”:“Sanat”,“grupoId”:null},{“id”:“seed_0187”,“tipo”:“gasto”,“tipoRegistro”:“real”,“categoria”:“inversion”,“subcategoria”:“Claude”,“detalle”:””,“monto”:74.8,“fecha”:“2026-04-21”,“persona”:“Sanat”,“grupoId”:null}];

// ============ HELPERS ============
const formatMonto = (v, moneda = ‘S/.’) => {
const n = Number(v) || 0;
return `${moneda} ${n.toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

const ajustarSiFinDeSemana = (fecha) => {
const d = new Date(fecha);
const dow = d.getDay(); // 0=dom, 6=sab
if (dow === 6) d.setDate(d.getDate() - 1); // sáb -> vie
if (dow === 0) d.setDate(d.getDate() - 2); // dom -> vie
return d;
};

// Devuelve el rango del mes financiero que CONTIENE la fecha dada
// Usa UTC puro con offset Lima para evitar problemas de timezone
const getRangoMesFinanciero = (fechaRef, diaInicio, ajustar) => {
// Trabajamos en UTC con offset Lima para todo
const refY = fechaRef.getUTCFullYear();
const refM = fechaRef.getUTCMonth();
const refD = fechaRef.getUTCDate();

// Candidato: inicio del mes actual
let inicioDate = new Date(Date.UTC(refY, refM, diaInicio, 12, 0, 0));
if (ajustar) inicioDate = ajustarSiFinDeSemana(inicioDate);

// Si la fecha de referencia es anterior al inicio candidato, retroceder un mes
const refUTC = Date.UTC(refY, refM, refD, 12, 0, 0);
if (refUTC < inicioDate.getTime()) {
inicioDate = new Date(Date.UTC(refY, refM - 1, diaInicio, 12, 0, 0));
if (ajustar) inicioDate = ajustarSiFinDeSemana(inicioDate);
}

// Fin = día anterior al próximo inicio
const nextM = inicioDate.getUTCMonth() + 1;
const nextY = inicioDate.getUTCFullYear() + (nextM > 11 ? 1 : 0);
let finDate = new Date(Date.UTC(nextY, nextM % 12, diaInicio, 12, 0, 0));
if (ajustar) finDate = ajustarSiFinDeSemana(finDate);
// Retroceder 1 día para obtener el último día del período
finDate = new Date(finDate.getTime() - 24 * 60 * 60 * 1000);

return { inicio: inicioDate, fin: finDate };
};

const formatFecha = (d) => {
const dd = String(d.getDate()).padStart(2, ‘0’);
const mm = String(d.getMonth() + 1).padStart(2, ‘0’);
const yyyy = d.getFullYear();
return `${dd}/${mm}/${yyyy}`;
};

const formatFechaCorta = (d) => {
const dd = String(d.getDate()).padStart(2, ‘0’);
const mm = String(d.getMonth() + 1).padStart(2, ‘0’);
return `${dd}/${mm}`;
};

// Zona horaria Lima (UTC-5, sin daylight saving)
const LIMA_OFFSET_MS = -5 * 60 * 60 * 1000;

const nowLima = () => {
const utc = Date.now();
return new Date(utc + LIMA_OFFSET_MS);
};

const toISODate = (d) => {
// Forzar interpretación en zona Lima
const lima = new Date(d.getTime() + LIMA_OFFSET_MS);
const yyyy = lima.getUTCFullYear();
const mm = String(lima.getUTCMonth() + 1).padStart(2, ‘0’);
const dd = String(lima.getUTCDate()).padStart(2, ‘0’);
return `${yyyy}-${mm}-${dd}`;
};

// Parsear “YYYY-MM-DD” como fecha local Lima (sin desfase por UTC)
const parseFechaLima = (s) => {
if (!s) return new Date();
// “2026-04-23” -> tratarlo como mediodia Lima para evitar que cambie de día
const [y, m, d] = s.split(’-’).map(Number);
return new Date(Date.UTC(y, m - 1, d, 12, 0, 0)); // mediodía UTC = mañana en Lima, seguro
};

const NOMBRES_MES = [‘Ene’, ‘Feb’, ‘Mar’, ‘Abr’, ‘May’, ‘Jun’, ‘Jul’, ‘Ago’, ‘Sep’, ‘Oct’, ‘Nov’, ‘Dic’];
const NOMBRES_MES_LARGO = [‘Enero’, ‘Febrero’, ‘Marzo’, ‘Abril’, ‘Mayo’, ‘Junio’, ‘Julio’, ‘Agosto’, ‘Septiembre’, ‘Octubre’, ‘Noviembre’, ‘Diciembre’];

// ============ STORAGE ============
// Configuración: se guardan ajustes/categorías en localStorage
// Las transacciones viven en Google Sheets via Apps Script (con cache local)
const STORAGE_KEYS = {
TRANSACCIONES_CACHE: ‘finanzas:tx_cache’,
CONFIG: ‘finanzas:config’,
CATEGORIAS_GASTO: ‘finanzas:cat_gasto’,
CATEGORIAS_INGRESO: ‘finanzas:cat_ingreso’,
SCRIPT_URL: ‘finanzas:script_url’,
PENDING_SYNC: ‘finanzas:pending_sync’,
};

const loadLocal = (key, fallback) => {
try {
const v = localStorage.getItem(key);
if (v) return JSON.parse(v);
return fallback;
} catch {
return fallback;
}
};

const saveLocal = (key, value) => {
try {
localStorage.setItem(key, JSON.stringify(value));
return true;
} catch (e) {
console.error(‘Error guardando’, key, e);
return false;
}
};

// API CLIENT para Apps Script
async function apiCall(scriptUrl, method, body) {
if (!scriptUrl) throw new Error(‘No hay URL de Google Apps Script configurada. Ve a Ajustes para configurarla.’);

const opts = method === ‘GET’
? { method: ‘GET’ }
: {
method: ‘POST’,
// Apps Script usa text/plain para evitar preflight CORS
headers: { ‘Content-Type’: ‘text/plain;charset=utf-8’ },
body: JSON.stringify(body),
};

const url = method === ‘GET’ ? scriptUrl + ‘?action=’ + body.action : scriptUrl;
const res = await fetch(url, opts);
const data = await res.json();
if (!data.ok) throw new Error(data.error || ‘Error desconocido’);
return data;
}

async function apiList(scriptUrl) {
const res = await apiCall(scriptUrl, ‘GET’, { action: ‘list’ });
const txs = res.data || [];
// Normalizar montos: reemplazar coma decimal por punto (Google Sheets en español usa coma)
return txs.map(tx => ({
…tx,
monto: typeof tx.monto === ‘string’
? parseFloat(tx.monto.replace(’,’, ‘.’)) || 0
: (Number(tx.monto) || 0),
}));
}

async function apiSave(scriptUrl, tx) {
const res = await apiCall(scriptUrl, ‘POST’, { action: ‘save’, tx });
return res.data;
}

async function apiSaveMany(scriptUrl, txs) {
return apiCall(scriptUrl, ‘POST’, { action: ‘saveMany’, txs });
}

async function apiDelete(scriptUrl, id) {
return apiCall(scriptUrl, ‘POST’, { action: ‘delete’, id });
}

async function apiDeleteGroup(scriptUrl, grupoId, fromDate) {
return apiCall(scriptUrl, ‘POST’, { action: ‘deleteGroup’, grupoId, fromDate });
}

async function apiUpdate(scriptUrl, id, changes) {
return apiCall(scriptUrl, ‘POST’, { action: ‘update’, id, changes });
}

async function apiReplaceAll(scriptUrl, txs) {
return apiCall(scriptUrl, ‘POST’, { action: ‘replaceAll’, txs });
}

async function apiListCats(scriptUrl) {
const res = await apiCall(scriptUrl, ‘GET’, { action: ‘listCats’ });
return res.data || [];
}

async function apiSaveCat(scriptUrl, cat) {
return apiCall(scriptUrl, ‘POST’, { action: ‘saveCat’, cat });
}

async function apiDeleteCat(scriptUrl, id) {
return apiCall(scriptUrl, ‘POST’, { action: ‘deleteCat’, id });
}

// ============ COMPONENTE PRINCIPAL ============
export default function App() {
const [vista, setVista] = useState(‘dashboard’); // dashboard | registro | analisis | config
const [transacciones, setTransacciones] = useState([]);
const [config, setConfig] = useState(DEFAULT_CONFIG);
const [catGasto, setCatGasto] = useState(DEFAULT_CATEGORIAS_GASTO);
const [catIngreso, setCatIngreso] = useState(DEFAULT_CATEGORIAS_INGRESO);
const [loading, setLoading] = useState(true);
const [fechaRef, setFechaRef] = useState(new Date());
const [showForm, setShowForm] = useState(false);
const [showQuick, setShowQuick] = useState(false);
const [editTx, setEditTx] = useState(null);
const [toast, setToast] = useState(null);

const [scriptUrl, setScriptUrl] = useState(’’);
const [syncStatus, setSyncStatus] = useState(‘idle’); // idle | syncing | error | offline

// Cargar datos iniciales
useEffect(() => {
(async () => {
const cfg = loadLocal(STORAGE_KEYS.CONFIG, DEFAULT_CONFIG);
const cg = loadLocal(STORAGE_KEYS.CATEGORIAS_GASTO, DEFAULT_CATEGORIAS_GASTO);
const ci = loadLocal(STORAGE_KEYS.CATEGORIAS_INGRESO, DEFAULT_CATEGORIAS_INGRESO);
const url = loadLocal(STORAGE_KEYS.SCRIPT_URL, ‘’);
const cache = loadLocal(STORAGE_KEYS.TRANSACCIONES_CACHE, []);

```
  setConfig(cfg);
  setCatGasto(cg);
  setCatIngreso(ci);
  setScriptUrl(url);
  setTransacciones(cache);

  if (url) {
    try {
      setSyncStatus('syncing');
      // Cargar transacciones y categorías en paralelo
      const [remoteTxs, remoteCats] = await Promise.all([
        apiList(url),
        apiListCats(url).catch(() => null), // si falla cats, no bloquear
      ]);

      setTransacciones(remoteTxs);
      saveLocal(STORAGE_KEYS.TRANSACCIONES_CACHE, remoteTxs);

      if (remoteCats && remoteCats.length > 0) {
        const gastos = remoteCats.filter(c => c.tipo === 'gasto')
          .sort((a, b) => (a.orden || 99) - (b.orden || 99));
        const ingresos = remoteCats.filter(c => c.tipo === 'ingreso')
          .sort((a, b) => (a.orden || 99) - (b.orden || 99));
        if (gastos.length > 0) { setCatGasto(gastos); saveLocal(STORAGE_KEYS.CATEGORIAS_GASTO, gastos); }
        if (ingresos.length > 0) { setCatIngreso(ingresos); saveLocal(STORAGE_KEYS.CATEGORIAS_INGRESO, ingresos); }
      }

      setSyncStatus('idle');
    } catch (e) {
      console.error('Error cargando desde Sheet:', e);
      setSyncStatus('error');
    }
  }

  setLoading(false);
})();
```

}, []);

const showToast = (msg, tipo = ‘success’) => {
setToast({ msg, tipo });
setTimeout(() => setToast(null), 2500);
};

// ============ ACCIONES (sincronizadas con Google Sheet) ============

// Helper: actualizar estado + cache local + opcional callback al server
const updateLocal = (newTxs) => {
setTransacciones(newTxs);
saveLocal(STORAGE_KEYS.TRANSACCIONES_CACHE, newTxs);
};

const guardarTx = async (tx) => {
if (!scriptUrl) {
alert(‘Primero configura la URL del Google Apps Script en Ajustes ⚙️’);
return;
}

```
if (tx.id) {
  // Editar existente
  const updated = { ...tx, monto: parseFloat(tx.monto) || 0 };
  const nuevas = transacciones.map(t => t.id === tx.id ? updated : t);
  updateLocal(nuevas);
  setShowForm(false);
  setEditTx(null);
  showToast('Actualizado ✓');

  try {
    setSyncStatus('syncing');
    await apiSave(scriptUrl, updated);
    setSyncStatus('idle');
  } catch (e) {
    console.error(e);
    setSyncStatus('error');
    showToast('No se pudo sincronizar', 'error');
  }
} else {
  // Nueva transacción - posible recurrencia
  const baseId = `tx_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
  const veces = Math.max(1, Math.min(12, parseInt(tx.veces) || 1));
  const nuevasTx = [];
  const fechaBase = new Date(tx.fecha);
  const grupoId = veces > 1 ? `grp_${Date.now()}` : null;

  for (let i = 0; i < veces; i++) {
    const fecha = new Date(fechaBase);
    fecha.setMonth(fecha.getMonth() + i);
    const nuevaTx = {
      tipo: tx.tipo,
      tipoRegistro: tx.tipoRegistro,
      categoria: tx.categoria,
      subcategoria: tx.subcategoria || '',
      detalle: tx.detalle || '',
      persona: tx.persona || config.persona,
      id: i === 0 ? baseId : `${baseId}_${i}`,
      fecha: toISODate(fecha),
      grupoId,
      monto: parseFloat(tx.monto) || 0,
    };
    nuevasTx.push(nuevaTx);
  }

  updateLocal([...transacciones, ...nuevasTx]);
  setShowForm(false);
  setEditTx(null);
  showToast(veces > 1 ? `${veces} registros guardados ✓` : 'Registrado ✓');

  try {
    setSyncStatus('syncing');
    if (nuevasTx.length === 1) {
      await apiSave(scriptUrl, nuevasTx[0]);
    } else {
      await apiSaveMany(scriptUrl, nuevasTx);
    }
    setSyncStatus('idle');
  } catch (e) {
    console.error(e);
    setSyncStatus('error');
    showToast('Guardado local. Falló sync.', 'error');
  }
}
```

};

const eliminarTx = async (id, soloEste = true) => {
if (!scriptUrl) {
alert(‘Primero configura la URL del Google Apps Script en Ajustes ⚙️’);
return;
}

```
const tx = transacciones.find(t => t.id === id);
if (!tx) return;

let nuevas;
if (!soloEste && tx.grupoId) {
  nuevas = transacciones.filter(t => {
    if (t.grupoId !== tx.grupoId) return true;
    return new Date(t.fecha) < new Date(tx.fecha);
  });
} else {
  nuevas = transacciones.filter(t => t.id !== id);
}
updateLocal(nuevas);
showToast('Eliminado');

try {
  setSyncStatus('syncing');
  if (!soloEste && tx.grupoId) {
    await apiDeleteGroup(scriptUrl, tx.grupoId, tx.fecha);
  } else {
    await apiDelete(scriptUrl, id);
  }
  setSyncStatus('idle');
} catch (e) {
  console.error(e);
  setSyncStatus('error');
  showToast('Eliminado local. Falló sync.', 'error');
}
```

};

const marcarComoReal = async (id) => {
if (!scriptUrl) {
alert(‘Primero configura la URL del Google Apps Script en Ajustes ⚙️’);
return;
}
const tx = transacciones.find(t => t.id === id);
if (!tx) return;

```
const nuevas = transacciones.map(t =>
  t.id === id ? { ...t, tipoRegistro: 'real' } : t
);
updateLocal(nuevas);
showToast('Marcado como real ✓');

try {
  setSyncStatus('syncing');
  await apiUpdate(scriptUrl, id, { tipoRegistro: 'real' });
  setSyncStatus('idle');
} catch (e) {
  console.error(e);
  setSyncStatus('error');
}
```

};

// Recargar manualmente desde el Sheet
const sincronizar = async () => {
if (!scriptUrl) return;
try {
setSyncStatus(‘syncing’);
const [remoteTxs, remoteCats] = await Promise.all([
apiList(scriptUrl),
apiListCats(scriptUrl).catch(() => null),
]);
updateLocal(remoteTxs);

```
  if (remoteCats && remoteCats.length > 0) {
    const gastos = remoteCats.filter(c => c.tipo === 'gasto').sort((a, b) => (a.orden||99)-(b.orden||99));
    const ingresos = remoteCats.filter(c => c.tipo === 'ingreso').sort((a, b) => (a.orden||99)-(b.orden||99));
    if (gastos.length > 0) { setCatGasto(gastos); saveLocal(STORAGE_KEYS.CATEGORIAS_GASTO, gastos); }
    if (ingresos.length > 0) { setCatIngreso(ingresos); saveLocal(STORAGE_KEYS.CATEGORIAS_INGRESO, ingresos); }
  }

  setSyncStatus('idle');
  showToast('Sincronizado ✓');
} catch (e) {
  console.error(e);
  setSyncStatus('error');
  showToast('Error al sincronizar', 'error');
}
```

};

// Guardar categoría en Sheet
const guardarCat = async (cat, tipo) => {
const catConTipo = { …cat, tipo };
if (tipo === ‘gasto’) {
const nuevas = catGasto.find(c => c.id === cat.id)
? catGasto.map(c => c.id === cat.id ? catConTipo : c)
: […catGasto, catConTipo];
setCatGasto(nuevas);
saveLocal(STORAGE_KEYS.CATEGORIAS_GASTO, nuevas);
} else {
const nuevas = catIngreso.find(c => c.id === cat.id)
? catIngreso.map(c => c.id === cat.id ? catConTipo : c)
: […catIngreso, catConTipo];
setCatIngreso(nuevas);
saveLocal(STORAGE_KEYS.CATEGORIAS_INGRESO, nuevas);
}
if (scriptUrl) {
try { await apiSaveCat(scriptUrl, catConTipo); } catch(e) { console.error(e); }
}
showToast(‘Categoría guardada ✓’);
};

const eliminarCat = async (id, tipo) => {
if (tipo === ‘gasto’) {
const nuevas = catGasto.filter(c => c.id !== id);
setCatGasto(nuevas);
saveLocal(STORAGE_KEYS.CATEGORIAS_GASTO, nuevas);
} else {
const nuevas = catIngreso.filter(c => c.id !== id);
setCatIngreso(nuevas);
saveLocal(STORAGE_KEYS.CATEGORIAS_INGRESO, nuevas);
}
if (scriptUrl) {
try { await apiDeleteCat(scriptUrl, id); } catch(e) { console.error(e); }
}
};

const exportarCSV = () => {
const header = [‘fecha’, ‘tipo’, ‘tipoRegistro’, ‘categoria’, ‘subcategoria’, ‘detalle’, ‘monto’, ‘persona’];
const rows = transacciones.map(t => [
t.fecha, t.tipo, t.tipoRegistro, t.categoria, t.subcategoria || ‘’,
t.detalle || ‘’, t.monto, t.persona || ‘’
]);
const csv = [header.join(’,’), …rows.map(r =>
r.map(c => `"${String(c).replace(/"/g, '""')}"`).join(’,’)
)].join(’\n’);
const blob = new Blob([csv], { type: ‘text/csv;charset=utf-8;’ });
const url = URL.createObjectURL(blob);
const a = document.createElement(‘a’);
a.href = url;
a.download = `finanzas_${toISODate(new Date())}.csv`;
a.click();
URL.revokeObjectURL(url);
showToast(‘CSV descargado ✓’);
};

// ============ DATOS DEL MES ACTUAL ============
const mesActual = useMemo(() => {
return getRangoMesFinanciero(fechaRef, config.diaInicioMes, config.ajustarFinDeSemana);
}, [fechaRef, config]);

const txDelMes = useMemo(() => {
return transacciones.filter(t => {
if (!t.fecha) return false;
const f = parseFechaLima(t.fecha);
return f >= mesActual.inicio && f <= mesActual.fin;
});
}, [transacciones, mesActual]);

const stats = useMemo(() => {
const ingresoProy = txDelMes.filter(t => t.tipo === ‘ingreso’ && t.tipoRegistro === ‘proyectado’).reduce((s, t) => s + Number(t.monto), 0);
const ingresoReal = txDelMes.filter(t => t.tipo === ‘ingreso’ && t.tipoRegistro === ‘real’).reduce((s, t) => s + Number(t.monto), 0);
const gastoProy = txDelMes.filter(t => t.tipo === ‘gasto’ && t.tipoRegistro === ‘proyectado’).reduce((s, t) => s + Number(t.monto), 0);
const gastoReal = txDelMes.filter(t => t.tipo === ‘gasto’ && t.tipoRegistro === ‘real’).reduce((s, t) => s + Number(t.monto), 0);
return {
ingresoProy, ingresoReal, gastoProy, gastoReal,
balanceProy: ingresoProy - gastoProy,
balanceReal: ingresoReal - gastoReal,
ejecucion: gastoProy > 0 ? (gastoReal / gastoProy) * 100 : 0,
};
}, [txDelMes]);

const navegarMes = (delta) => {
const nuevo = new Date(fechaRef);
nuevo.setMonth(nuevo.getMonth() + delta);
setFechaRef(nuevo);
};

// Detectar si el sistema prefiere oscuro (para modo auto)
const sistemaOscuro = typeof window !== ‘undefined’ && window.matchMedia && window.matchMedia(’(prefers-color-scheme: dark)’).matches;
const temaActivo = config.tema === ‘auto’ ? (sistemaOscuro ? ‘oscuro’ : ‘claro’) : (config.tema || ‘claro’);
const isDark = temaActivo === ‘oscuro’;
const acento = ACENTOS[config.acento || ‘amber’];

if (loading) {
return (
<div className={`min-h-screen flex items-center justify-center ${isDark ? 'bg-stone-950' : 'bg-stone-50'}`}>
<div className={`font-serif text-xl italic ${isDark ? 'text-stone-300' : 'text-stone-600'}`}>Cargando…</div>
</div>
);
}

const D = {
// Backgrounds
bg: isDark ? ‘bg-stone-950’ : ‘bg-stone-50’,
bgCard: isDark ? ‘bg-stone-900’ : ‘bg-white’,
bgMuted: isDark ? ‘bg-stone-800’ : ‘bg-stone-100’,
bgInput: isDark ? ‘bg-stone-800’ : ‘bg-white’,
bgHero: isDark ? ‘from-stone-950 via-stone-900 to-stone-950’ : ‘from-stone-900 via-stone-800 to-stone-900’,
// Bordes
border: isDark ? ‘border-stone-700’ : ‘border-stone-200’,
borderMuted: isDark ? ‘border-stone-700’ : ‘border-stone-300’,
// Textos
text: isDark ? ‘text-stone-100’ : ‘text-stone-900’,
textMuted: isDark ? ‘text-stone-400’ : ‘text-stone-500’,
textSub: isDark ? ‘text-stone-300’ : ‘text-stone-700’,
// Glass (header/nav)
glass: isDark ? ‘bg-stone-950/80 backdrop-blur-md’ : ‘bg-white/80 backdrop-blur-md’,
// Accent
accentText: acento.text,
accentBorder: acento.border,
accentDot: acento.dot,
};

return (
<div className={`min-h-screen ${D.bg} pb-24 transition-colors duration-300`} style={{ fontFamily: “‘Plus Jakarta Sans’, system-ui, sans-serif” }}>
<style>{`@import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600;9..144,700;9..144,800;9..144,900&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap'); .font-serif { font-family: 'Fraunces', Georgia, serif; font-feature-settings: 'ss01' on; } .font-sans { font-family: 'Plus Jakarta Sans', system-ui, sans-serif; } .grain { background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.04 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E"); } @keyframes slide-up { from { transform: translateY(100%); opacity: 0; } to { transform: translateY(0); opacity: 1; } } @keyframes fade-in { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } } .animate-slide-up { animation: slide-up 0.3s cubic-bezier(0.16, 1, 0.3, 1); } .animate-fade-in { animation: fade-in 0.4s ease-out; } .stagger > * { animation: fade-in 0.5s ease-out backwards; } .stagger > *:nth-child(1) { animation-delay: 0.05s; } .stagger > *:nth-child(2) { animation-delay: 0.1s; } .stagger > *:nth-child(3) { animation-delay: 0.15s; } .stagger > *:nth-child(4) { animation-delay: 0.2s; } .stagger > *:nth-child(5) { animation-delay: 0.25s; } .dark-date::-webkit-calendar-picker-indicator { filter: invert(1); }`}</style>
{isDark && <style>{’.date-input::-webkit-calendar-picker-indicator { filter: invert(1); }’}</style>}

```
  {/* ========= HEADER ========= */}
  <header className={`sticky top-0 z-30 border-b ${D.glass} ${D.border}`}>
    <div className="max-w-2xl mx-auto px-5 py-4 flex items-center justify-between">
      <div>
        <h1 className={`font-serif text-2xl font-semibold leading-none tracking-tight ${D.text}`}>
          Finanzas<span className={`${D.accentText} italic`}>.</span>
        </h1>
        <p className={`text-[11px] uppercase tracking-widest mt-1 flex items-center gap-1.5 ${D.textMuted}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${!scriptUrl ? 'bg-stone-400' : syncStatus === 'error' ? 'bg-red-500' : syncStatus === 'syncing' ? 'bg-amber-500 animate-pulse' : 'bg-emerald-500'}`} />
          {config.persona}
        </p>
      </div>
      <div className="flex items-center gap-1">
        {scriptUrl && (
          <button
            onClick={sincronizar}
            disabled={syncStatus === 'syncing'}
            className={`p-2 rounded-full transition disabled:opacity-50 hover:${D.bgMuted}`}
            title="Sincronizar"
          >
            <span className={`${D.textMuted} text-lg inline-block ${syncStatus === 'syncing' ? 'animate-spin' : ''}`}>↻</span>
          </button>
        )}
        <button
          onClick={() => setVista('config')}
          className={`p-2 rounded-full transition hover:${D.bgMuted}`}
        >
          <Settings className={`w-5 h-5 ${D.textMuted}`} />
        </button>
      </div>
    </div>
  </header>

  {/* ========= NAVEGADOR DE MES ========= */}
  <div className="max-w-2xl mx-auto px-5 pt-4">
    <div className={`flex items-center justify-between rounded-2xl border p-3 shadow-sm ${D.bgCard} ${D.border}`}>
      <button onClick={() => navegarMes(-1)} className={`p-2 rounded-full transition hover:${D.bgMuted}`}>
        <ChevronLeft className={`w-5 h-5 ${D.text}`} />
      </button>
      <div className="text-center">
        <div className={`font-serif text-lg font-semibold ${D.text}`}>
          {formatFechaCorta(mesActual.inicio)} – {formatFechaCorta(mesActual.fin)}
        </div>
        <div className={`text-[10px] uppercase tracking-widest mt-0.5 ${D.textMuted}`}>
          {NOMBRES_MES_LARGO[mesActual.inicio.getUTCMonth()]} {mesActual.inicio.getUTCFullYear()}
        </div>
      </div>
      <button onClick={() => navegarMes(1)} className={`p-2 rounded-full transition hover:${D.bgMuted}`}>
        <ChevronRight className={`w-5 h-5 ${D.text}`} />
      </button>
    </div>
  </div>

  {/* ========= VISTAS ========= */}
  <main className="max-w-2xl mx-auto px-5 pt-5">
    {vista === 'dashboard' && (
      <Dashboard stats={stats} txDelMes={txDelMes} catGasto={catGasto} catIngreso={catIngreso} config={config} D={D} onMarcarReal={marcarComoReal} onEditar={(tx) => { setEditTx(tx); setShowForm(true); }} onEliminar={eliminarTx} />
    )}
    {vista === 'registro' && (
      <Registro transacciones={txDelMes} catGasto={catGasto} catIngreso={catIngreso} config={config} D={D} onMarcarReal={marcarComoReal} onEditar={(tx) => { setEditTx(tx); setShowForm(true); }} onEliminar={eliminarTx} />
    )}
    {vista === 'analisis' && (
      <Analisis txDelMes={txDelMes} catGasto={catGasto} catIngreso={catIngreso} config={config} stats={stats} D={D} />
    )}
    {vista === 'config' && (
      <Config config={config} setConfig={(c) => { setConfig(c); saveLocal(STORAGE_KEYS.CONFIG, c); showToast('Guardado ✓'); }}
        catGasto={catGasto} catIngreso={catIngreso}
        onGuardarCat={guardarCat}
        onEliminarCat={eliminarCat}
        onExport={exportarCSV}
        totalTx={transacciones.length}
        scriptUrl={scriptUrl}
        setScriptUrl={(u) => { setScriptUrl(u); saveLocal(STORAGE_KEYS.SCRIPT_URL, u); }}
        transacciones={transacciones}
        onSincronizar={sincronizar}
        syncStatus={syncStatus}
        D={D}
        isDark={isDark}
      />
    )}
  </main>

  {/* ========= FAB con registro rápido ========= */}
  {vista !== 'config' && (
    <FAB
      onQuick={() => setShowQuick(true)}
      onFull={() => { setEditTx(null); setShowForm(true); }}
      D={D}
    />
  )}

  {/* ========= BOTTOM NAV ========= */}
  <nav className={`fixed bottom-0 left-0 right-0 z-30 border-t ${D.glass} ${D.border}`}>
    <div className="max-w-2xl mx-auto px-2 py-2 grid grid-cols-4">
      {[
        { id: 'dashboard', icon: Wallet, label: 'Resumen' },
        { id: 'registro', icon: BarChart3, label: 'Registros' },
        { id: 'analisis', icon: PieChart, label: 'Análisis' },
        { id: 'config', icon: Settings, label: 'Ajustes' },
      ].map(item => (
        <button
          key={item.id}
          onClick={() => setVista(item.id)}
          className={`flex flex-col items-center gap-1 py-2 rounded-xl transition ${vista === item.id ? D.accentText : D.textMuted}`}
        >
          <item.icon className="w-5 h-5" strokeWidth={vista === item.id ? 2.5 : 1.75} />
          <span className={`text-[10px] uppercase tracking-wider ${vista === item.id ? 'font-semibold' : ''}`}>{item.label}</span>
        </button>
      ))}
    </div>
  </nav>

  {/* ========= QUICK ENTRY ========= */}
  {showQuick && (
    <QuickEntry
      catGasto={catGasto}
      config={config}
      transacciones={transacciones}
      onGuardar={(tx) => { guardarTx(tx); setShowQuick(false); }}
      onCerrar={() => setShowQuick(false)}
      onCompleto={() => { setShowQuick(false); setEditTx(null); setShowForm(true); }}
      D={D}
    />
  )}

  {/* ========= FORM MODAL ========= */}
  {showForm && (
    <FormularioTx
      tx={editTx}
      catGasto={catGasto}
      catIngreso={catIngreso}
      config={config}
      transacciones={transacciones}
      onGuardar={guardarTx}
      onCerrar={() => { setShowForm(false); setEditTx(null); }}
      D={D}
    />
  )}

  {/* ========= TOAST ========= */}
  {toast && (
    <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 animate-fade-in">
      <div className={`px-4 py-2.5 rounded-full shadow-lg text-sm font-medium ${toast.tipo === 'success' ? 'bg-stone-900 text-white' : 'bg-red-500 text-white'}`}>
        {toast.msg}
      </div>
    </div>
  )}
</div>
```

);
}

// ============ DASHBOARD ============
function Dashboard({ stats, txDelMes, catGasto, catIngreso, config, D, onMarcarReal, onEditar, onEliminar }) {
const ultimas = useMemo(() => {
return […txDelMes]
.sort((a, b) => (b.fecha || ‘’).localeCompare(a.fecha || ‘’))
.slice(0, 5);
}, [txDelMes]);

const findCat = (tipo, id) => {
const cats = tipo === ‘gasto’ ? catGasto : catIngreso;
const found = cats.find(c => c.id === id);
if (found) return found;
// Fallback: convertir id a nombre legible (fijo_agua -> Fijo Agua)
const nombre = (id || ‘Otros’).replace(/_/g, ’ ’).replace(/\w/g, l => l.toUpperCase());
return { emoji: ‘📦’, nombre, color: ‘#8D99AE’ };
};

const [hidden, setHidden] = useState(false);
const M = (v, mon) => hidden ? `${mon} ••••` : formatMonto(v, mon);

return (
<div className="space-y-5 stagger animate-fade-in">
{/* HERO BALANCE */}
<div className={`relative overflow-hidden rounded-3xl bg-gradient-to-br ${D.bgHero} text-white p-6 shadow-xl`}>
<div className="absolute inset-0 grain opacity-30" />
<div className="absolute -top-20 -right-20 w-64 h-64 bg-amber-500/20 rounded-full blur-3xl" />
<div className="relative">
<div className="flex items-center justify-between">
<p className="text-[10px] uppercase tracking-[0.2em] text-stone-400">Balance del período</p>
<button onClick={() => setHidden(h => !h)}
className=“p-1.5 rounded-full hover:bg-white/10 transition active:scale-95”
title={hidden ? ‘Mostrar montos’ : ‘Ocultar montos’}>
{hidden
? <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-stone-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
: <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-stone-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
}
</button>
</div>
<div className="mt-3 flex items-baseline gap-2">
<span className={`font-serif font-semibold tracking-tight transition-all duration-200 ${hidden ? 'text-3xl blur-[3px] select-none' : 'text-5xl'}`}>
{M(stats.balanceReal, config.moneda)}
</span>
</div>
<div className="mt-4 flex items-center gap-4 text-sm">
<div>
<span className="text-stone-400 text-xs">Proyectado</span>
<div className={`font-medium transition-all ${hidden ? 'blur-[3px] select-none' : ''}`}>
{M(stats.balanceProy, config.moneda)}
</div>
</div>
<div className="h-8 w-px bg-stone-700" />
<div>
<span className="text-stone-400 text-xs">Diferencia</span>
<div className={`font-medium transition-all ${hidden ? 'blur-[3px] select-none' : (stats.balanceReal - stats.balanceProy >= 0 ? 'text-emerald-400' : 'text-amber-400')}`}>
{hidden ? `${config.moneda} ••••` : `${stats.balanceReal - stats.balanceProy >= 0 ? '+' : ''}${formatMonto(stats.balanceReal - stats.balanceProy, config.moneda)}`}
</div>
</div>
</div>
</div>
</div>

```
  {/* CARDS INGRESO/GASTO */}
  <div className="grid grid-cols-2 gap-3">
    <CardMetric icon={<TrendingUp className="w-4 h-4" />} label="Ingresos" real={stats.ingresoReal} proy={stats.ingresoProy} accent="emerald" moneda={config.moneda} D={D} hidden={hidden} />
    <CardMetric icon={<TrendingDown className="w-4 h-4" />} label="Gastos" real={stats.gastoReal} proy={stats.gastoProy} accent="red" moneda={config.moneda} D={D} hidden={hidden} />
  </div>

  {/* EJECUCIÓN PRESUPUESTO */}
  <div className={`rounded-2xl border p-5 shadow-sm ${D.bgCard} ${D.border}`}>
    <div className="flex items-baseline justify-between mb-3">
      <div>
        <p className={`text-[10px] uppercase tracking-widest ${D.textMuted}`}>Ejecución de presupuesto</p>
        <p className={`font-serif text-2xl font-semibold mt-1 ${D.text}`}>
          {stats.ejecucion.toFixed(0)}<span className={`text-base ${D.textMuted}`}>%</span>
        </p>
      </div>
      <div className={`px-2.5 py-1 rounded-full text-[11px] font-semibold uppercase tracking-wide ${stats.ejecucion <= 80 ? 'bg-emerald-50 text-emerald-700' : stats.ejecucion <= 100 ? 'bg-amber-50 text-amber-700' : 'bg-red-50 text-red-700'}`}>
        {stats.ejecucion <= 80 ? 'Saludable' : stats.ejecucion <= 100 ? 'Al límite' : 'Excedido'}
      </div>
    </div>
    <div className={`h-2 rounded-full overflow-hidden ${D.bgMuted}`}>
      <div
        className={`h-full transition-all duration-700 ${stats.ejecucion <= 80 ? 'bg-emerald-500' : stats.ejecucion <= 100 ? 'bg-amber-500' : 'bg-red-500'}`}
        style={{ width: `${Math.min(stats.ejecucion, 100)}%` }}
      />
    </div>
    <p className={`text-xs mt-2 ${D.textMuted}`}>
      Has gastado{' '}
      <span className={hidden ? 'blur-[3px] select-none' : ''}>{M(stats.gastoReal, config.moneda)}</span>
      {' '}de{' '}
      <span className={hidden ? 'blur-[3px] select-none' : ''}>{M(stats.gastoProy, config.moneda)}</span>
      {' '}presupuestados
    </p>
  </div>

  {/* ÚLTIMOS MOVIMIENTOS */}
  <div>
    <div className="flex items-baseline justify-between mb-3 px-1">
      <h2 className={`font-serif text-xl font-semibold ${D.text}`}>Movimientos recientes</h2>
      <span className={`text-xs ${D.textMuted}`}>{txDelMes.length} en total</span>
    </div>
    {ultimas.length === 0 ? (
      <div className={`rounded-2xl border border-dashed p-8 text-center ${D.bgCard} ${D.borderMuted}`}>
        <p className={`text-sm ${D.textMuted}`}>Aún no hay movimientos en este período</p>
        <p className={`text-xs mt-1 ${D.textMuted}`}>Toca el botón + para registrar</p>
      </div>
    ) : (
      <div className="space-y-2">
        {ultimas.map(tx => (
          <ItemTx key={tx.id} tx={tx} cat={findCat(tx.tipo, tx.categoria)} moneda={config.moneda} onMarcarReal={onMarcarReal} onEditar={onEditar} onEliminar={onEliminar} D={D} />
        ))}
      </div>
    )}
  </div>
</div>
```

);
}

function CardMetric({ icon, label, real, proy, accent, moneda, D, hidden }) {
const ratio = proy > 0 ? (real / proy) * 100 : 0;
const accentMap = {
emerald: { text: ‘text-emerald-700’, bg: ‘bg-emerald-50’, icon: ‘bg-emerald-100 text-emerald-700’ },
red: { text: ‘text-red-700’, bg: ‘bg-red-50’, icon: ‘bg-red-100 text-red-700’ },
};
const a = accentMap[accent];
return (
<div className={`rounded-2xl border p-4 shadow-sm ${D.bgCard} ${D.border}`}>
<div className="flex items-center gap-2 mb-3">
<div className={`w-7 h-7 rounded-full ${a.icon} flex items-center justify-center`}>
{icon}
</div>
<span className={`text-[10px] uppercase tracking-widest font-medium ${D.textMuted}`}>{label}</span>
</div>
<div className={`font-serif text-2xl font-semibold tracking-tight transition-all ${hidden ? "blur-[3px] select-none" : ""} ${D.text}`}>
{hidden ? `${moneda} ••••` : formatMonto(real, moneda)}
</div>
<div className={`mt-2 text-[11px] ${D.textMuted}`}>
de <span className={hidden ? “blur-[3px] select-none” : “”}>{hidden ? `${moneda} ••••` : formatMonto(proy, moneda)}</span> <span className={D.textMuted}>proyectado</span>
</div>
</div>
);
}

function ItemTx({ tx, cat, moneda, onMarcarReal, onEditar, onEliminar, D }) {
const esGasto = tx.tipo === ‘gasto’;
const esProy = tx.tipoRegistro === ‘proyectado’;
const [open, setOpen] = useState(false);
const fecha = parseFechaLima(tx.fecha);

return (
<div className={`rounded-2xl border overflow-hidden shadow-sm ${D.bgCard} ${D.border}`}>
<button
onClick={() => setOpen(!open)}
className={`w-full p-3.5 flex items-center gap-3 transition hover:${D.bgMuted}`}
>
<div
className=“w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0”
style={{ backgroundColor: cat.color + ‘22’ }}
>
{cat.emoji}
</div>
<div className="flex-1 min-w-0 text-left">
<div className="flex items-center gap-1.5">
<p className={`font-medium text-sm truncate ${D.text}`}>{tx.detalle || cat.nombre}</p>
{esProy && <span className="text-[9px] uppercase tracking-wide bg-stone-100 text-stone-600 px-1.5 py-0.5 rounded font-semibold">Proy</span>}
{tx.grupoId && <Repeat className="w-3 h-3 text-stone-400" />}
</div>
<p className={`text-[11px] mt-0.5 ${D.textMuted}`}>
{formatFechaCorta(fecha)} · {cat.nombre}
{tx.subcategoria && ` · ${tx.subcategoria}`}
</p>
</div>
<div className={`font-serif font-semibold text-base ${esGasto ? 'text-stone-900' : 'text-emerald-700'}`}>
{esGasto ? ‘−’ : ‘+’}{formatMonto(tx.monto, moneda).replace(moneda + ’ ‘, ‘’)}
</div>
</button>
{open && (
<div className={`border-t p-3 flex gap-2 ${D.bgMuted} ${D.border}`}>
{esProy && (
<button
onClick={() => onMarcarReal(tx.id)}
className=“flex-1 text-xs font-medium px-3 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition flex items-center justify-center gap-1.5”
>
<Check className="w-3.5 h-3.5" /> Marcar como real
</button>
)}
<button
onClick={() => { onEditar(tx); setOpen(false); }}
className={`flex-1 text-xs font-medium px-3 py-2 rounded-lg transition ${D.bgCard} border ${D.border} ${D.text} hover:opacity-80`}
>
Editar
</button>
<button
onClick={() => {
if (tx.grupoId) {
if (confirm(’¿Eliminar solo este o todos los futuros?\n\nOK = solo este\nCancelar = ver más opciones’)) {
onEliminar(tx.id, true);
} else {
if (confirm(’¿Eliminar esta y todas las futuras del grupo recurrente?’)) {
onEliminar(tx.id, false);
}
}
} else {
if (confirm(’¿Eliminar este registro?’)) onEliminar(tx.id, true);
}
}}
className=“px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition”
>
<Trash2 className="w-3.5 h-3.5" />
</button>
</div>
)}
</div>
);
}

// ============ REGISTRO ============
function Registro({ transacciones, catGasto, catIngreso, config, D, onMarcarReal, onEditar, onEliminar }) {
const [filtro, setFiltro] = useState(‘todos’); // todos | proyectado | real | gasto | ingreso
const findCat = (tipo, id) => {
const cats = tipo === ‘gasto’ ? catGasto : catIngreso;
const found = cats.find(c => c.id === id);
if (found) return found;
const nombre = (id || ‘Otros’).replace(/_/g, ’ ’).replace(/\w/g, l => l.toUpperCase());
return { emoji: ‘📦’, nombre, color: ‘#8D99AE’ };
};

const filtradas = useMemo(() => {
let f = […transacciones];
if (filtro === ‘proyectado’) f = f.filter(t => t.tipoRegistro === ‘proyectado’);
else if (filtro === ‘real’) f = f.filter(t => t.tipoRegistro === ‘real’);
else if (filtro === ‘gasto’) f = f.filter(t => t.tipo === ‘gasto’);
else if (filtro === ‘ingreso’) f = f.filter(t => t.tipo === ‘ingreso’);
// Descendente por fecha de ejecución (campo fecha), no por actualización
return f.sort((a, b) => {
const fa = a.fecha || ‘’;
const fb = b.fecha || ‘’;
return fb.localeCompare(fa);
});
}, [transacciones, filtro]);

const filtros = [
{ id: ‘todos’, label: ‘Todos’ },
{ id: ‘real’, label: ‘Reales’ },
{ id: ‘proyectado’, label: ‘Proyectados’ },
{ id: ‘gasto’, label: ‘Gastos’ },
{ id: ‘ingreso’, label: ‘Ingresos’ },
];

return (
<div className="space-y-4 animate-fade-in">
<div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1">
{filtros.map(f => (
<button
key={f.id}
onClick={() => setFiltro(f.id)}
className={`px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition ${filtro === f.id ? 'bg-stone-900 text-white' : D.bgCard + ' border ' + D.border + ' ' + D.textSub + ' hover:opacity-80'}`}
>
{f.label}
</button>
))}
</div>

```
  {filtradas.length === 0 ? (
    <div className="bg-white rounded-2xl border border-dashed border-stone-300 p-10 text-center">
      <p className="text-stone-500 text-sm">No hay registros con este filtro</p>
    </div>
  ) : (
    <div className="space-y-2">
      {filtradas.map(tx => (
        <ItemTx key={tx.id} tx={tx} cat={findCat(tx.tipo, tx.categoria)} moneda={config.moneda} onMarcarReal={onMarcarReal} onEditar={onEditar} onEliminar={onEliminar} D={D} />
      ))}
    </div>
  )}
</div>
```

);
}

// ============ ANÁLISIS ============
function Analisis({ txDelMes, catGasto, catIngreso, config, stats, D }) {
const analisisCat = useMemo(() => {
const map = {};
txDelMes.filter(t => t.tipo === ‘gasto’).forEach(t => {
if (!map[t.categoria]) map[t.categoria] = { proy: 0, real: 0 };
if (t.tipoRegistro === ‘proyectado’) map[t.categoria].proy += Number(t.monto);
else map[t.categoria].real += Number(t.monto);
});
return Object.entries(map).map(([catId, vals]) => {
const cat = catGasto.find(c => c.id === catId) || { emoji: ‘📦’, nombre: catId, color: ‘#888’ };
return {
…cat,
…vals,
diff: vals.proy - vals.real,
ejecucion: vals.proy > 0 ? (vals.real / vals.proy) * 100 : (vals.real > 0 ? 999 : 0),
};
}).sort((a, b) => Math.max(b.proy, b.real) - Math.max(a.proy, a.real));
}, [txDelMes, catGasto]);

const analisisIng = useMemo(() => {
const map = {};
txDelMes.filter(t => t.tipo === ‘ingreso’).forEach(t => {
if (!map[t.categoria]) map[t.categoria] = { proy: 0, real: 0 };
if (t.tipoRegistro === ‘proyectado’) map[t.categoria].proy += Number(t.monto);
else map[t.categoria].real += Number(t.monto);
});
return Object.entries(map).map(([catId, vals]) => {
const cat = catIngreso.find(c => c.id === catId) || { emoji: ‘💵’, nombre: catId, color: ‘#888’ };
return { …cat, …vals };
}).sort((a, b) => Math.max(b.proy, b.real) - Math.max(a.proy, a.real));
}, [txDelMes, catIngreso]);

return (
<div className="space-y-5 animate-fade-in">
{/* RESUMEN COMPARATIVO */}
<div className={`rounded-2xl border p-5 shadow-sm ${D.bgCard} ${D.border}`}>
<h2 className={`font-serif text-lg font-semibold mb-4 ${D.text}`}>Proyectado vs Real</h2>
<div className="space-y-3">
<BarraComparativa label="Ingresos" proy={stats.ingresoProy} real={stats.ingresoReal} moneda={config.moneda} positivo D={D} />
<BarraComparativa label="Gastos" proy={stats.gastoProy} real={stats.gastoReal} moneda={config.moneda} D={D} />
<div className="pt-3 border-t border-stone-100">
<BarraComparativa label="Balance" proy={stats.balanceProy} real={stats.balanceReal} moneda={config.moneda} positivo D={D} />
</div>
</div>
</div>

```
  {/* GASTOS POR CATEGORÍA */}
  <div>
    <h2 className={`font-serif text-xl font-semibold mb-3 px-1 ${D.text}`}>Gastos por categoría</h2>
    {analisisCat.length === 0 ? (
      <div className={`rounded-2xl border border-dashed p-6 text-center ${D.bgCard} ${D.borderMuted}`}>
        <p className={`text-sm ${D.textMuted}`}>Sin gastos en este período</p>
      </div>
    ) : (
      <div className="space-y-2">
        {analisisCat.map(c => (
          <CategoriaCard key={c.id} cat={c} moneda={config.moneda} D={D} />
        ))}
      </div>
    )}
  </div>

  {/* INGRESOS POR CATEGORÍA */}
  {analisisIng.length > 0 && (
    <div>
      <h2 className={`font-serif text-xl font-semibold mb-3 px-1 ${D.text}`}>Ingresos por categoría</h2>
      <div className="space-y-2">
        {analisisIng.map(c => (
          <div key={c.id} className={`rounded-2xl border p-4 shadow-sm ${D.bgCard} ${D.border}`}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg" style={{ backgroundColor: c.color + '22' }}>
                {c.emoji}
              </div>
              <div className="flex-1">
                <p className={`font-medium text-sm ${D.text}`}>{c.nombre}</p>
                <div className="flex gap-3 mt-1 text-[11px] text-stone-500">
                  <span>Proy: <strong className="text-stone-700">{formatMonto(c.proy, config.moneda)}</strong></span>
                  <span>Real: <strong className="text-emerald-700">{formatMonto(c.real, config.moneda)}</strong></span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )}
</div>
```

);
}

function BarraComparativa({ label, proy, real, moneda, positivo, D }) {
const max = Math.max(Math.abs(proy), Math.abs(real), 1);
const pctProy = (Math.abs(proy) / max) * 100;
const pctReal = (Math.abs(real) / max) * 100;
const diff = real - proy;

return (
<div>
<div className="flex items-baseline justify-between mb-1.5">
<span className={`text-xs font-medium uppercase tracking-wide ${D.textSub}`}>{label}</span>
<span className={`text-[11px] font-medium ${ positivo ? (diff >= 0 ? 'text-emerald-600' : 'text-red-600') : (diff <= 0 ? 'text-emerald-600' : 'text-red-600') }`}>
{diff >= 0 ? ‘+’ : ‘’}{formatMonto(diff, moneda)}
</span>
</div>
<div className="space-y-1.5">
<div className="flex items-center gap-2">
<span className={`text-[10px] w-10 ${D.textMuted}`}>Proy</span>
<div className={`flex-1 h-1.5 rounded-full overflow-hidden ${D.bgMuted}`}>
<div className=“h-full bg-stone-400 rounded-full transition-all” style={{ width: `${pctProy}%` }} />
</div>
<span className={`text-[11px] font-medium w-20 text-right ${D.textSub}`}>{formatMonto(proy, moneda)}</span>
</div>
<div className="flex items-center gap-2">
<span className={`text-[10px] w-10 ${D.textMuted}`}>Real</span>
<div className={`flex-1 h-1.5 rounded-full overflow-hidden ${D.bgMuted}`}>
<div className={`h-full rounded-full transition-all ${positivo ? 'bg-emerald-500' : 'bg-red-500'}`} style={{ width: `${pctReal}%` }} />
</div>
<span className="text-[11px] text-stone-900 font-semibold w-20 text-right">{formatMonto(real, moneda)}</span>
</div>
</div>
</div>
);
}

function CategoriaCard({ cat, moneda, D }) {
const ejec = Math.min(cat.ejecucion, 150);
const color = cat.ejecucion <= 80 ? ‘bg-emerald-500’ : cat.ejecucion <= 100 ? ‘bg-amber-500’ : ‘bg-red-500’;

return (
<div className={`rounded-2xl border p-4 shadow-sm ${D.bgCard} ${D.border}`}>
<div className="flex items-center gap-3 mb-3">
<div className=“w-10 h-10 rounded-xl flex items-center justify-center text-lg” style={{ backgroundColor: cat.color + ‘22’ }}>
{cat.emoji}
</div>
<div className="flex-1">
<p className={`font-medium text-sm ${D.text}`}>{cat.nombre}</p>
<p className={`text-[11px] mt-0.5 ${D.textMuted}`}>
{formatMonto(cat.real, moneda)} <span className="text-stone-400">/ {formatMonto(cat.proy, moneda)}</span>
</p>
</div>
<div className={`text-xs font-bold px-2 py-1 rounded ${cat.ejecucion <= 80 ? 'bg-emerald-50 text-emerald-700' : cat.ejecucion <= 100 ? 'bg-amber-50 text-amber-700' : 'bg-red-50 text-red-700'}`}>
{cat.ejecucion >= 999 ? ‘sin proy’ : `${cat.ejecucion.toFixed(0)}%`}
</div>
</div>
<div className="h-1.5 bg-stone-100 rounded-full overflow-hidden">
<div className={`h-full ${color} transition-all duration-500`} style={{ width: `${Math.min(ejec / 1.5, 100)}%` }} />
</div>
{cat.diff !== 0 && (
<p className={`text-[11px] mt-2 ${cat.diff >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
{cat.diff >= 0
? `Te quedan ${formatMonto(cat.diff, moneda)}`
: `Excediste por ${formatMonto(Math.abs(cat.diff), moneda)}`}
</p>
)}
</div>
);
}

// ============ FAB ============
function FAB({ onQuick, onFull, D }) {
const [open, setOpen] = useState(false);

return (
<>
{/* Overlay para cerrar */}
{open && (
<div className=“fixed inset-0 z-20” onClick={() => setOpen(false)} />
)}

```
  {/* Mini botones — flotan POR ENCIMA del botón principal */}
  <div className={`fixed z-30 flex flex-col items-end gap-4 transition-all duration-250
    ${open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}
  `} style={{ bottom: '7.5rem', right: '1.25rem' }}>

    {/* Registro completo — primero (más arriba) */}
    <div className={`flex items-center gap-3 transition-all duration-200 ${open ? 'translate-y-0' : 'translate-y-6'}`}
      style={{ transitionDelay: open ? '60ms' : '0ms' }}>
      <span className={`text-xs font-semibold px-3 py-1.5 rounded-full shadow-md whitespace-nowrap ${D.bgCard} ${D.text} border ${D.border}`}>
        Registro completo
      </span>
      <button
        onClick={() => { setOpen(false); onFull(); }}
        className="w-12 h-12 bg-stone-700 hover:bg-stone-600 text-white rounded-full shadow-xl flex items-center justify-center transition-all active:scale-95 flex-shrink-0"
      >
        <Plus className="w-5 h-5" />
      </button>
    </div>

    {/* Registro rápido — segundo (más cerca del principal) */}
    <div className={`flex items-center gap-3 transition-all duration-200 ${open ? 'translate-y-0' : 'translate-y-6'}`}
      style={{ transitionDelay: open ? '0ms' : '0ms' }}>
      <span className={`text-xs font-semibold px-3 py-1.5 rounded-full shadow-md whitespace-nowrap ${D.bgCard} ${D.text} border ${D.border}`}>
        Registro rápido ⚡
      </span>
      <button
        onClick={() => { setOpen(false); onQuick(); }}
        className="w-12 h-12 bg-amber-500 hover:bg-amber-400 text-white rounded-full shadow-xl flex items-center justify-center transition-all active:scale-95 flex-shrink-0"
      >
        <Zap className="w-5 h-5" />
      </button>
    </div>
  </div>

  {/* Botón principal — siempre en bottom-24 right-5, z más alto para quedar encima del overlay */}
  <button
    onClick={() => setOpen(!open)}
    className={`fixed z-30 w-14 h-14 text-white rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 active:scale-95 ${open ? 'bg-stone-500' : 'bg-stone-900 hover:bg-stone-800'}`}
    style={{
      bottom: '5.5rem',
      right: '1.25rem',
      boxShadow: '0 10px 30px -5px rgba(0,0,0,0.45)',
      transform: open ? 'rotate(45deg)' : 'rotate(0deg)',
    }}
  >
    <Plus className="w-6 h-6" />
  </button>
</>
```

);
}

// ============ QUICK ENTRY ============
function QuickEntry({ catGasto, config, transacciones, onGuardar, onCerrar, onCompleto, D }) {
const [monto, setMonto] = useState(’’);
const [categoria, setCategoria] = useState(’’);
const [detalle, setDetalle] = useState(’’);
const [tipoRegistro, setTipoRegistro] = useState(‘real’);
const [step, setStep] = useState(‘monto’); // monto | categoria | confirm
const inputRef = React.useRef(null);

// Top 6 categorías más usadas
const topCats = React.useMemo(() => {
const counts = {};
(transacciones || []).filter(t => t.tipo === ‘gasto’).forEach(t => {
counts[t.categoria] = (counts[t.categoria] || 0) + 1;
});
const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]).map(([id]) => id);
const top = sorted.slice(0, 6);
if (top.length < 6) {
catGasto.forEach(c => { if (!top.includes(c.id) && top.length < 6) top.push(c.id); });
}
return top.map(id => catGasto.find(c => c.id === id)).filter(Boolean);
}, [transacciones, catGasto]);

React.useEffect(() => {
if (step === ‘monto’) setTimeout(() => inputRef.current?.focus(), 100);
}, [step]);

const handleMonto = (v) => {
// Solo permitir números y punto/coma
const clean = v.replace(/[^0-9.,]/g, ‘’);
setMonto(clean);
};

const confirmarMonto = () => {
if (!monto || parseFloat(monto.replace(’,’, ‘.’)) <= 0) return;
setStep(‘categoria’);
};

const seleccionarCat = (id) => {
setCategoria(id);
setStep(‘confirm’);
};

const guardar = () => {
const cat = catGasto.find(c => c.id === categoria);
onGuardar({
tipo: ‘gasto’,
tipoRegistro,
categoria,
subcategoria: ‘’,
detalle,
monto: parseFloat(monto.replace(’,’, ‘.’)) || 0,
fecha: toISODate(nowLima()),
persona: config.persona,
veces: 1,
});
};

const cat = catGasto.find(c => c.id === categoria);

return (
<div className="fixed inset-0 z-40 bg-black/60 flex items-end justify-center">
<div className={`w-full max-w-md animate-slide-up rounded-t-3xl shadow-2xl overflow-hidden ${D.bg}`}>

```
    {/* Barra de progreso */}
    <div className="flex gap-1 px-5 pt-4 mb-1">
      {['monto','categoria','confirm'].map((s, i) => (
        <div key={s} className={`h-1 flex-1 rounded-full transition-all duration-300 ${
          step === s ? 'bg-amber-500' :
          ['monto','categoria','confirm'].indexOf(step) > i ? 'bg-stone-400' : (D.bgMuted.includes('stone-800') ? 'bg-stone-700' : 'bg-stone-200')
        }`} />
      ))}
    </div>

    {/* STEP 1: Monto */}
    {step === 'monto' && (
      <div className="px-5 pt-3 pb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className={`font-serif text-lg font-semibold ${D.text}`}>⚡ Registro rápido</p>
            <p className={`text-xs ${D.textMuted}`}>¿Cuánto gastaste?</p>
          </div>
          <button onClick={onCerrar} className={`p-1.5 rounded-full ${D.bgMuted}`}>
            <X className={`w-4 h-4 ${D.textMuted}`} />
          </button>
        </div>

        {/* Display del monto */}
        <div className="text-center py-4">
          <div className="flex items-baseline justify-center gap-2">
            <span className={`font-serif text-3xl ${D.textMuted}`}>{config.moneda}</span>
            <span className={`font-serif text-6xl font-semibold tracking-tight ${monto ? D.text : D.textMuted}`}>
              {monto || '0'}
            </span>
          </div>
        </div>

        {/* Teclado numérico */}
        <div className="grid grid-cols-3 gap-2 mb-3">
          {['1','2','3','4','5','6','7','8','9','.','0','⌫'].map(k => (
            <button
              key={k}
              onClick={() => {
                if (k === '⌫') setMonto(m => m.slice(0, -1));
                else if (k === '.' && monto.includes('.')) return;
                else handleMonto(monto + k);
              }}
              className={`h-14 rounded-2xl font-serif text-2xl font-medium transition active:scale-95 ${k === '⌫' ? D.bgMuted + ' ' + D.textMuted : D.bgCard + ' border ' + D.border + ' ' + D.text + ' hover:opacity-80'}`}
            >
              {k}
            </button>
          ))}
        </div>

        {/* Real / Proyectado */}
        <div className={`grid grid-cols-2 gap-1 p-1 rounded-xl mb-3 ${D.bgMuted}`}>
          {['real','proyectado'].map(t => (
            <button key={t} onClick={() => setTipoRegistro(t)}
              className={`py-2 rounded-lg text-xs font-medium transition capitalize ${tipoRegistro === t ? D.bgCard + ' shadow-sm ' + D.text : D.textMuted}`}
            >
              {t === 'real' ? '⚡ Real' : '📅 Proyectado'}
            </button>
          ))}
        </div>

        <button
          onClick={confirmarMonto}
          disabled={!monto || parseFloat(monto.replace(',','.')) <= 0}
          className="w-full py-4 bg-amber-500 hover:bg-amber-400 text-white font-semibold rounded-2xl text-lg transition disabled:opacity-30 active:scale-[0.98]"
        >
          Continuar →
        </button>
      </div>
    )}

    {/* STEP 2: Categoría */}
    {step === 'categoria' && (
      <div className="px-5 pt-3 pb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className={`font-serif text-lg font-semibold ${D.text}`}>
              {config.moneda} {monto}
            </p>
            <p className={`text-xs ${D.textMuted}`}>¿En qué lo gastaste?</p>
          </div>
          <button onClick={() => setStep('monto')} className={`p-1.5 rounded-full ${D.bgMuted}`}>
            <ChevronLeft className={`w-4 h-4 ${D.textMuted}`} />
          </button>
        </div>

        {/* Top 6 categorías */}
        <div className="grid grid-cols-3 gap-2 mb-4">
          {topCats.map(c => (
            <button
              key={c.id}
              onClick={() => seleccionarCat(c.id)}
              className={`p-3 rounded-2xl border-2 flex flex-col items-center gap-1.5 transition active:scale-95 border-transparent hover:border-stone-300 ${D.bgCard}`}
              style={{ borderColor: categoria === c.id ? c.color : undefined }}
            >
              <span className="text-2xl">{c.emoji}</span>
              <span className={`text-[10px] font-medium text-center leading-tight ${D.textSub}`}>{c.nombre}</span>
            </button>
          ))}
        </div>

        {/* Detalle opcional */}
        <input
          type="text"
          value={detalle}
          onChange={e => setDetalle(e.target.value)}
          placeholder="Detalle (opcional) — ej: almuerzo, taxi..."
          className={`w-full px-3 py-2.5 rounded-xl text-sm border outline-none mb-3 ${D.bgInput} ${D.border} ${D.text}`}
        />

        <button
          onClick={onCompleto}
          className={`w-full py-2.5 rounded-xl text-sm font-medium border transition ${D.bgCard} ${D.border} ${D.textSub}`}
        >
          Más opciones (categorías, recurrencia...)
        </button>
      </div>
    )}

    {/* STEP 3: Confirmación */}
    {step === 'confirm' && cat && (
      <div className="px-5 pt-3 pb-8">
        <div className="flex items-center justify-between mb-6">
          <p className={`font-serif text-lg font-semibold ${D.text}`}>Confirmar</p>
          <button onClick={() => setStep('categoria')} className={`p-1.5 rounded-full ${D.bgMuted}`}>
            <ChevronLeft className={`w-4 h-4 ${D.textMuted}`} />
          </button>
        </div>

        {/* Resumen visual */}
        <div className={`rounded-2xl p-5 mb-6 border ${D.bgCard} ${D.border}`}>
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0"
              style={{ backgroundColor: cat.color + '22' }}>
              {cat.emoji}
            </div>
            <div className="flex-1">
              <p className={`font-serif text-3xl font-semibold ${D.text}`}>
                {config.moneda} {monto}
              </p>
              <p className={`text-sm ${D.textMuted} mt-0.5`}>{cat.nombre}{detalle ? ` · ${detalle}` : ''}</p>
            </div>
          </div>
          <div className={`mt-4 pt-3 border-t flex items-center justify-between text-xs ${D.border} ${D.textMuted}`}>
            <span>{formatFecha(nowLima())} · {tipoRegistro === 'real' ? '⚡ Real' : '📅 Proyectado'}</span>
            <span>{config.persona}</span>
          </div>
        </div>

        <button
          onClick={guardar}
          className="w-full py-4 bg-stone-900 hover:bg-stone-800 text-white font-semibold rounded-2xl text-lg transition active:scale-[0.98] shadow-lg"
        >
          ✓ Guardar gasto
        </button>
        <button onClick={onCerrar} className={`w-full mt-2 py-2.5 rounded-2xl text-sm ${D.textMuted}`}>
          Cancelar
        </button>
      </div>
    )}
  </div>
</div>
```

);
}

// ============ FORMULARIO ============
function FormularioTx({ tx, catGasto, catIngreso, config, transacciones, onGuardar, onCerrar, D }) {
const [tipo, setTipo] = useState(tx?.tipo || ‘gasto’);
const [tipoRegistro, setTipoRegistro] = useState(tx?.tipoRegistro || ‘real’);
const [categoria, setCategoria] = useState(tx?.categoria || ‘’);
const [subcategoria, setSubcategoria] = useState(tx?.subcategoria || ‘’);
const [detalle, setDetalle] = useState(tx?.detalle || ‘’);
const [monto, setMonto] = useState(tx?.monto || ‘’);
const [fecha, setFecha] = useState(tx?.fecha || toISODate(nowLima()));
const [veces, setVeces] = useState(1);
const [showAllCats, setShowAllCats] = useState(false);
const [showOptional, setShowOptional] = useState(false);

const cats = tipo === ‘gasto’ ? catGasto : catIngreso;
const editando = !!tx?.id;

// Calcular las categorías más usadas según el tipo
const topCats = useMemo(() => {
const counts = {};
(transacciones || []).filter(t => t.tipo === tipo).forEach(t => {
counts[t.categoria] = (counts[t.categoria] || 0) + 1;
});
const sorted = Object.entries(counts)
.sort((a, b) => b[1] - a[1])
.map(([id]) => id);

```
// Si hay menos de 3 categorías usadas, completar con las primeras del catálogo
const top3 = sorted.slice(0, 3);
if (top3.length < 3) {
  cats.forEach(c => {
    if (!top3.includes(c.id) && top3.length < 3) top3.push(c.id);
  });
}
return top3.map(id => cats.find(c => c.id === id)).filter(Boolean);
```

}, [transacciones, tipo, cats]);

// Si la categoría seleccionada no está en top3, mostrar todas
useEffect(() => {
if (categoria && !topCats.find(c => c.id === categoria)) {
setShowAllCats(true);
}
}, [categoria, topCats]);

const submit = () => {
if (!categoria || !monto) {
alert(‘Completa la categoría y el monto’);
return;
}
onGuardar({
…(tx?.id ? { id: tx.id, grupoId: tx.grupoId } : {}),
tipo, tipoRegistro, categoria, subcategoria, detalle,
monto: parseFloat(monto), fecha, persona: config.persona,
veces: editando ? 1 : veces,
});
};

return (
<div className="fixed inset-0 z-40 bg-black/60 flex items-end sm:items-center justify-center p-0 sm:p-4">
<div className={`w-full sm:max-w-md rounded-t-3xl sm:rounded-3xl max-h-[92vh] flex flex-col animate-slide-up shadow-2xl ${D.bg}`}>

```
    {/* HERO: Header + Toggle + Monto todo junto, no sticky */}
    <div className={`px-5 pt-4 pb-5 rounded-t-3xl ${D.bgMuted}`}>
      <div className="flex items-center justify-between mb-3">
        <h2 className={`font-serif text-lg font-semibold ${D.text}`}>{editando ? 'Editar' : 'Nuevo registro'}</h2>
        <button onClick={onCerrar} className={`p-1.5 rounded-full -mr-1.5 hover:${D.bgCard}`}>
          <X className={`w-5 h-5 ${D.text}`} />
        </button>
      </div>

      {/* Toggle Tipo - segmented control */}
      <div className={`grid grid-cols-2 gap-1 p-1 rounded-xl mb-4 ${D.bgMuted}`}>
        <button
          onClick={() => { setTipo('gasto'); setCategoria(''); setShowAllCats(false); }}
          className={`py-1.5 rounded-lg text-xs font-medium transition ${tipo === 'gasto' ? D.bgCard + ' shadow-sm ' + D.text : D.textMuted}`}
        >
          💸 Gasto
        </button>
        <button
          onClick={() => { setTipo('ingreso'); setCategoria(''); setShowAllCats(false); }}
          className={`py-1.5 rounded-lg text-xs font-medium transition ${tipo === 'ingreso' ? D.bgCard + ' shadow-sm ' + D.text : D.textMuted}`}
        >
          💰 Ingreso
        </button>
      </div>

      {/* MONTO - HERO CENTRAL */}
      <div className="text-center">
        <div className="flex items-center justify-center gap-1.5">
          <span className={`font-serif text-xl mt-2 ${D.textMuted}`}>{config.moneda}</span>
          <input
            type="number"
            inputMode="decimal"
            value={monto}
            onChange={e => setMonto(e.target.value)}
            placeholder="0.00"
            step="0.01"
            autoFocus={!editando}
            className={`font-serif text-4xl font-semibold bg-transparent text-center w-44 outline-none focus:outline-none placeholder:text-stone-400 ${D.text}`}
          />
        </div>
      </div>

      {/* Tipo Registro - chips compactos */}
      <div className="flex gap-2 justify-center mt-3">
        <button
          onClick={() => setTipoRegistro('real')}
          className={`px-3 py-1.5 rounded-full text-xs font-medium transition flex items-center gap-1 ${tipoRegistro === 'real' ? 'bg-stone-900 text-white' : 'bg-white border border-stone-200 text-stone-600'}`}
        >
          <Zap className="w-3 h-3" /> Real
        </button>
        <button
          onClick={() => setTipoRegistro('proyectado')}
          className={`px-3 py-1.5 rounded-full text-xs font-medium transition flex items-center gap-1 ${tipoRegistro === 'proyectado' ? 'bg-stone-900 text-white' : 'bg-white border border-stone-200 text-stone-600'}`}
        >
          <Calendar className="w-3 h-3" /> Proyectado
        </button>
      </div>
    </div>

    {/* CONTENIDO SCROLLABLE */}
    <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">

      {/* Categoría */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-[10px] uppercase tracking-widest text-stone-500">Categoría</label>
          {topCats.length > 0 && cats.length > 3 && (
            <button
              onClick={() => setShowAllCats(!showAllCats)}
              className={`text-[11px] font-medium ${D.accentText}`}
            >
              {showAllCats ? '↑ Ver menos' : `↓ Ver todas (${cats.length})`}
            </button>
          )}
        </div>

        {!showAllCats ? (
          // Vista compacta: top 3 + más
          <div className="grid grid-cols-4 gap-2">
            {topCats.map(c => (
              <button
                key={c.id}
                onClick={() => setCategoria(c.id)}
                className={`p-2 rounded-xl border-2 transition flex flex-col items-center gap-0.5 ${categoria === c.id ? 'bg-white' : 'border-stone-200 bg-white hover:border-stone-300'}`}
                style={{ borderColor: categoria === c.id ? c.color : undefined }}
              >
                <span className="text-xl">{c.emoji}</span>
                <span className={`text-[9px] font-medium leading-tight text-center line-clamp-1 ${D.textSub}`}>{c.nombre}</span>
              </button>
            ))}
            {cats.length > 3 && (
              <button
                onClick={() => setShowAllCats(true)}
                className={`p-2 rounded-xl border-2 border-dashed transition flex flex-col items-center justify-center gap-0.5 ${D.bgMuted} ${D.borderMuted}`}
              >
                <span className="text-lg">⋯</span>
                <span className={`text-[9px] font-medium ${D.textSub}`}>Más</span>
              </button>
            )}
          </div>
        ) : (
          // Vista expandida: todas las categorías
          <div className="grid grid-cols-4 gap-2">
            {cats.map(c => (
              <button
                key={c.id}
                onClick={() => setCategoria(c.id)}
                className={`p-2 rounded-xl border-2 transition flex flex-col items-center gap-0.5 ${categoria === c.id ? 'bg-white' : 'border-stone-200 bg-white hover:border-stone-300'}`}
                style={{ borderColor: categoria === c.id ? c.color : undefined }}
              >
                <span className="text-xl">{c.emoji}</span>
                <span className={`text-[9px] font-medium leading-tight text-center line-clamp-1 ${D.textSub}`}>{c.nombre}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Fecha - siempre visible, compacto */}
      <div>
        <label className={`text-[10px] uppercase tracking-widest mb-1.5 block ${D.textMuted}`}>Fecha</label>
        <input
          type="date"
          value={fecha}
          onChange={e => setFecha(e.target.value)}
          className={`w-full px-3 py-2 rounded-xl text-sm outline-none border ${D.bgInput} ${D.border} ${D.text}`}
        />
      </div>

      {/* Recurrencia - solo en nuevos */}
      {!editando && (
        <div>
          <label className="text-[10px] uppercase tracking-widest text-stone-500 mb-1.5 block flex items-center gap-1.5">
            <Repeat className="w-3 h-3" /> Repetir mensualmente
          </label>
          <div className="flex gap-1.5">
            {[1, 3, 6, 12].map(v => (
              <button
                key={v}
                onClick={() => setVeces(v)}
                className={`flex-1 py-2 rounded-lg text-xs font-medium border transition ${veces === v ? 'bg-stone-900 text-white border-stone-900' : 'bg-white border-stone-200 text-stone-600 hover:border-stone-300'}`}
              >
                {v === 1 ? 'Solo 1' : `${v} meses`}
              </button>
            ))}
          </div>
          {veces > 1 && (
            <p className="text-[11px] text-stone-500 mt-1.5 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              Se crearán {veces} registros, uno por mes
            </p>
          )}
        </div>
      )}

      {/* Detalle y subcategoría - colapsables */}
      <button
        onClick={() => setShowOptional(!showOptional)}
        className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition ${D.bgCard} border ${D.border} ${D.textSub}`}
      >
        <span className="flex items-center gap-1.5">
          <span className="text-stone-400">＋</span> Detalle y subcategoría (opcional)
        </span>
        <span className="text-stone-400">{showOptional ? '▲' : '▼'}</span>
      </button>

      {showOptional && (
        <div className="space-y-3 -mt-2">
          <input
            type="text"
            value={detalle}
            onChange={e => setDetalle(e.target.value)}
            placeholder="Detalle (ej: Pago de luz)"
            className={`w-full px-3 py-2 rounded-xl text-sm outline-none border ${D.bgInput} ${D.border} ${D.text}`}
          />
          <input
            type="text"
            value={subcategoria}
            onChange={e => setSubcategoria(e.target.value)}
            placeholder="Subcategoría (ej: Servicios)"
            className={`w-full px-3 py-2 rounded-xl text-sm outline-none border ${D.bgInput} ${D.border} ${D.text}`}
          />
        </div>
      )}
    </div>

    {/* FOOTER STICKY con botón guardar */}
    <div className={`px-5 py-3 border-t ${D.bgMuted} ${D.border}`}>
      <button
        onClick={submit}
        className="w-full py-3 bg-stone-900 hover:bg-stone-800 text-white font-semibold rounded-xl transition shadow-lg active:scale-[0.98]"
      >
        {editando ? 'Actualizar' : 'Guardar registro'}
      </button>
    </div>
  </div>
</div>
```

);
}

// ============ CONFIG ============
function Config({ config, setConfig, catGasto, catIngreso, onGuardarCat, onEliminarCat,
onExport, totalTx, scriptUrl, setScriptUrl, transacciones, onSincronizar, syncStatus, D, isDark }) {

const [showCats, setShowCats] = useState(null); // ‘gasto’ | ‘ingreso’ | null
const [editandoCat, setEditandoCat] = useState(null); // null | ‘new’ | cat object
const [nuevaCat, setNuevaCat] = useState({ nombre: ‘’, emoji: ‘📦’, color: ‘#8D99AE’ });
const [tempScriptUrl, setTempScriptUrl] = useState(scriptUrl || ‘’);
const [migrating, setMigrating] = useState(false);
const [syncingCats, setSyncingCats] = useState(false);

const cats = showCats === ‘gasto’ ? catGasto : catIngreso;

const handleGuardarCat = () => {
if (!nuevaCat.nombre.trim()) return;
const id = nuevaCat.id || nuevaCat.nombre.toLowerCase()
.normalize(‘NFD’).replace(/[\u0300-\u036f]/g, ‘’)
.replace(/[^a-z0-9]/g, ‘*’).replace(/*+/g, ‘*’).replace(/^*|_$/g, ‘’);
onGuardarCat({ …nuevaCat, id }, showCats);
setNuevaCat({ nombre: ‘’, emoji: ‘📦’, color: ‘#8D99AE’ });
setEditandoCat(null);
};

const handleEditarCat = (cat) => {
setEditandoCat(cat);
setNuevaCat({ …cat });
};

const handleEliminarCat = (id) => {
if (!confirm(’¿Eliminar esta categoría? Los registros existentes no se borran.’)) return;
onEliminarCat(id, showCats);
};

return (
<div className="space-y-4 animate-fade-in">

```
  {/* Persona */}
  <Section D={D} titulo="Tu nombre">
    <input type="text" value={config.persona}
      onChange={e => setConfig({ ...config, persona: e.target.value })}
      className={`w-full px-3.5 py-2.5 rounded-xl text-sm outline-none border ${D.bgInput} ${D.border} ${D.text}`}
    />
  </Section>

  {/* Inicio de mes */}
  <Section D={D} titulo="Día de inicio del período">
    <p className={`text-xs mb-2 ${D.textMuted}`}>El día que recibes tu pago.</p>
    <div className="flex items-center gap-2">
      <input type="number" min="1" max="28" value={config.diaInicioMes}
        onChange={e => setConfig({ ...config, diaInicioMes: parseInt(e.target.value) || 1 })}
        className={`w-20 px-3 py-2 rounded-xl text-sm text-center font-serif text-lg outline-none border ${D.bgInput} ${D.border} ${D.text}`}
      />
      <span className={`text-sm ${D.textSub}`}>de cada mes</span>
    </div>
    <label className="flex items-center gap-2 mt-3 cursor-pointer">
      <input type="checkbox" checked={config.ajustarFinDeSemana}
        onChange={e => setConfig({ ...config, ajustarFinDeSemana: e.target.checked })}
        className="w-4 h-4"
      />
      <span className={`text-sm ${D.textSub}`}>Si cae fin de semana, ajustar al viernes</span>
    </label>
  </Section>

  {/* Moneda */}
  <Section D={D} titulo="Moneda">
    <div className="grid grid-cols-4 gap-2">
      {['S/.', '$', '€', '£'].map(m => (
        <button key={m} onClick={() => setConfig({ ...config, moneda: m })}
          className={`py-2 rounded-xl border-2 font-serif text-lg ${config.moneda === m ? 'border-stone-900 bg-stone-900 text-white' : D.border + ' ' + D.bgCard}`}
        >{m}</button>
      ))}
    </div>
  </Section>

  {/* Apariencia */}
  <Section D={D} titulo="Apariencia">
    <div className="space-y-4">
      <div>
        <p className={`text-[10px] uppercase tracking-widest mb-2 ${D.textMuted}`}>Tema</p>
        <div className="grid grid-cols-3 gap-2">
          {[{ id: 'claro', emoji: '☀️', label: 'Claro' }, { id: 'oscuro', emoji: '🌙', label: 'Oscuro' }, { id: 'auto', emoji: '⚙️', label: 'Sistema' }].map(t => (
            <button key={t.id} onClick={() => setConfig({ ...config, tema: t.id })}
              className={`p-3 rounded-xl border-2 flex flex-col items-center gap-1 transition ${config.tema === t.id ? 'border-stone-900 ' + D.bgMuted : D.border + ' ' + D.bgCard}`}
            >
              <span className="text-xl">{t.emoji}</span>
              <span className={`text-[11px] font-medium ${D.textSub}`}>{t.label}</span>
            </button>
          ))}
        </div>
      </div>
      <div>
        <p className={`text-[10px] uppercase tracking-widest mb-2 ${D.textMuted}`}>Color de acento</p>
        <div className="flex gap-1.5 flex-wrap">
          {Object.entries(ACENTOS).map(([id, a]) => (
            <button key={id} onClick={() => setConfig({ ...config, acento: id })}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full border-2 transition text-xs font-medium ${config.acento === id ? 'border-stone-900' : D.border} ${D.bgCard}`}
            >
              <span className="w-3 h-3 rounded-full inline-block" style={{ backgroundColor: a.dot }} />
              <span className={D.textSub}>{a.label}</span>
              {config.acento === id && <span className={D.accentText}>✓</span>}
            </button>
          ))}
        </div>
      </div>
    </div>
  </Section>

  {/* Categorías */}
  <Section D={D} titulo="Categorías">
    <p className={`text-xs mb-3 ${D.textMuted}`}>
      Se sincronizan con la hoja <strong>App_Config</strong> de tu Sheet.
    </p>
    <div className="grid grid-cols-2 gap-2">
      <button onClick={() => { setShowCats('gasto'); setEditandoCat(null); }}
        className={`p-3 rounded-xl border text-sm font-medium text-left ${D.bgCard} ${D.border} ${D.text}`}>
        💸 Gastos <span className={D.textMuted}>({catGasto.length})</span>
      </button>
      <button onClick={() => { setShowCats('ingreso'); setEditandoCat(null); }}
        className={`p-3 rounded-xl border text-sm font-medium text-left ${D.bgCard} ${D.border} ${D.text}`}>
        💰 Ingresos <span className={D.textMuted}>({catIngreso.length})</span>
      </button>
    </div>
  </Section>

  {/* Conexión a Google Sheets */}
  <Section D={D} titulo="Conexión a Google Sheets">
    <p className={`text-xs mb-3 ${D.textMuted}`}>Tus datos y categorías se guardan en tu Sheet.</p>
    <div className="flex items-center gap-2 mb-2">
      <div className={`w-2 h-2 rounded-full ${scriptUrl ? (syncStatus === 'error' ? 'bg-red-500' : syncStatus === 'syncing' ? 'bg-amber-500 animate-pulse' : 'bg-emerald-500') : 'bg-stone-300'}`} />
      <span className={`text-xs ${D.textSub}`}>
        {!scriptUrl ? 'Sin conectar' : syncStatus === 'error' ? 'Error de conexión' : syncStatus === 'syncing' ? 'Sincronizando...' : 'Conectado ✓'}
      </span>
    </div>
    <input type="url" value={tempScriptUrl} onChange={e => setTempScriptUrl(e.target.value)}
      placeholder="https://script.google.com/macros/s/.../exec"
      className={`w-full px-3 py-2 rounded-xl text-xs outline-none border font-mono ${D.bgInput} ${D.border} ${D.text}`}
    />
    <div className="grid grid-cols-2 gap-2 mt-2">
      <button onClick={() => { setScriptUrl(tempScriptUrl.trim()); setTimeout(() => location.reload(), 300); }}
        disabled={!tempScriptUrl.trim() || tempScriptUrl === scriptUrl}
        className="py-2.5 bg-stone-900 text-white rounded-xl text-sm font-medium disabled:opacity-30">
        Guardar URL
      </button>
      <button onClick={onSincronizar} disabled={!scriptUrl || syncStatus === 'syncing'}
        className={`py-2.5 rounded-xl text-sm font-medium disabled:opacity-30 border ${D.bgCard} ${D.border} ${D.text}`}>
        🔄 Sincronizar
      </button>
    </div>
  </Section>

  {/* Datos */}
  <Section D={D} titulo="Datos">
    <p className={`text-xs mb-3 ${D.textMuted}`}>{totalTx} registros guardados</p>
    <div className="grid grid-cols-2 gap-2">
      <button onClick={onExport}
        className={`flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium border ${D.bgCard} ${D.border} ${D.text}`}>
        <Download className="w-4 h-4" /> Exportar CSV
      </button>
      <button onClick={async () => {
        if (!scriptUrl) { alert('Primero configura la URL del Apps Script'); return; }
        if (!confirm(`🔄 Subir ${SEED_DATA.length} datos originales de Sanat a App_Data. ¿Continuar?`)) return;
        try { setMigrating(true); await apiReplaceAll(scriptUrl, SEED_DATA); alert('✅ Listo'); location.reload(); }
        catch (e) { alert('Error: ' + e.message); }
        finally { setMigrating(false); }
      }} disabled={migrating}
        className="flex items-center justify-center gap-2 py-2.5 bg-amber-50 text-amber-700 border border-amber-200 rounded-xl text-sm font-medium hover:bg-amber-100 disabled:opacity-50">
        <Upload className="w-4 h-4" /> {migrating ? 'Cargando...' : 'Cargar semilla'}
      </button>
    </div>
    <button onClick={async () => {
      if (!scriptUrl) { alert('Primero configura la URL del Apps Script'); return; }
      if (!confirm('⚠️ Borrará TODOS los registros. ¿Continuar?')) return;
      try { await apiReplaceAll(scriptUrl, []); location.reload(); }
      catch (e) { alert('Error: ' + e.message); }
    }} className="w-full mt-2 flex items-center justify-center gap-2 py-2.5 bg-red-50 text-red-600 border border-red-200 rounded-xl text-sm font-medium hover:bg-red-100">
      <Trash2 className="w-4 h-4" /> Borrar todo
    </button>
  </Section>

  <p className={`text-center text-[11px] pt-2 ${D.textMuted}`}>
    {scriptUrl ? <>Datos en tu Google Sheet 🟢<br /><span className="opacity-60">App_Data · App_Config</span></> : <>⚠️ Configura la URL del Apps Script<br />para guardar datos en Sheets</>}
  </p>

  {/* ===== MODAL CATEGORÍAS ===== */}
  {showCats && (
    <div className="fixed inset-0 z-40 bg-black/60 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className={`w-full sm:max-w-md rounded-t-3xl sm:rounded-3xl max-h-[92vh] flex flex-col animate-slide-up shadow-2xl ${D.bg}`}>

        {/* Header del modal */}
        <div className={`px-5 pt-4 pb-3 border-b ${D.bgMuted} ${D.border} rounded-t-3xl flex items-center justify-between`}>
          <div>
            <h2 className={`font-serif text-lg font-semibold ${D.text}`}>
              {showCats === 'gasto' ? '💸 Gastos' : '💰 Ingresos'}
            </h2>
            <p className={`text-[11px] ${D.textMuted}`}>{cats.length} categorías · sincroniza con App_Config</p>
          </div>
          <button onClick={() => { setShowCats(null); setEditandoCat(null); }}
            className={`p-1.5 rounded-full ${D.bgCard}`}>
            <X className={`w-5 h-5 ${D.text}`} />
          </button>
        </div>

        {/* Lista scrollable */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-2">
          {cats.map(c => (
            <div key={c.id} className={`rounded-xl border p-3 flex items-center gap-3 ${D.bgCard} ${D.border}`}>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
                style={{ backgroundColor: c.color + '22' }}>
                {c.emoji}
              </div>
              <div className="flex-1 min-w-0">
                <p className={`font-medium text-sm ${D.text}`}>{c.nombre}</p>
                <p className={`text-[10px] ${D.textMuted}`}>{c.id}</p>
              </div>
              <button onClick={() => handleEditarCat(c)}
                className={`text-xs px-2.5 py-1.5 rounded-lg border ${D.bgMuted} ${D.border} ${D.textSub}`}>
                Editar
              </button>
              <button onClick={() => handleEliminarCat(c.id)}
                className="text-xs px-2.5 py-1.5 rounded-lg bg-red-50 text-red-500 border border-red-200">
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>

        {/* Footer: nueva/editar categoría */}
        <div className={`border-t px-5 py-4 ${D.bgMuted} ${D.border}`}>
          <p className={`text-[10px] uppercase tracking-widest mb-2 ${D.textMuted}`}>
            {editandoCat && editandoCat.id ? 'Editar categoría' : 'Nueva categoría'}
          </p>
          <div className="flex gap-2 mb-2">
            <input type="text" value={nuevaCat.emoji}
              onChange={e => setNuevaCat({ ...nuevaCat, emoji: e.target.value })}
              placeholder="🎯" maxLength={2}
              className={`w-12 px-2 py-2 border rounded-lg text-center text-xl ${D.bgInput} ${D.border} ${D.text}`}
            />
            <input type="text" value={nuevaCat.nombre}
              onChange={e => setNuevaCat({ ...nuevaCat, nombre: e.target.value })}
              placeholder="Nombre de la categoría"
              className={`flex-1 px-3 py-2 border rounded-lg text-sm ${D.bgInput} ${D.border} ${D.text}`}
            />
          </div>
          {/* Colores */}
          <div className="flex gap-1.5 mb-3 flex-wrap">
            {['#E76F51','#F4A261','#E9C46A','#2A9D8F','#264653','#8338EC','#FF006E','#3A86FF','#06D6A0','#9D4EDD','#EF233C','#FFD60A'].map(col => (
              <button key={col} onClick={() => setNuevaCat({ ...nuevaCat, color: col })}
                className={`w-7 h-7 rounded-full transition ${nuevaCat.color === col ? 'ring-2 ring-offset-2 ring-stone-900' : ''}`}
                style={{ backgroundColor: col }} />
            ))}
          </div>
          <div className="flex gap-2">
            <button onClick={handleGuardarCat} disabled={!nuevaCat.nombre.trim()}
              className="flex-1 py-2.5 bg-stone-900 text-white rounded-xl text-sm font-medium disabled:opacity-30">
              {editandoCat && editandoCat.id ? 'Actualizar' : '+ Agregar'}
            </button>
            {editandoCat && (
              <button onClick={() => { setEditandoCat(null); setNuevaCat({ nombre: '', emoji: '📦', color: '#8D99AE' }); }}
                className={`px-4 py-2.5 rounded-xl text-sm border ${D.bgCard} ${D.border} ${D.text}`}>
                Cancelar
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )}
</div>
```

);
}

function Section({ titulo, children, D }) {
return (
<div className={`rounded-2xl border p-5 shadow-sm ${D.bgCard} ${D.border}`}>
<h3 className={`font-serif text-base font-semibold mb-3 ${D.text}`}>{titulo}</h3>
{children}
</div>
);
}
