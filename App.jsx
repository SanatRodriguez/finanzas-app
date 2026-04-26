import React, { useState, useEffect, useMemo } from 'react';
import {
  Wallet, TrendingUp, TrendingDown, Plus, Trash2, Calendar,
  PieChart, BarChart3, Settings, ChevronLeft, ChevronRight,
  Download, Upload, X, Check, AlertCircle, Repeat, Zap
} from 'lucide-react';

// ============ CATEGORÍAS POR DEFECTO ============
const DEFAULT_CATEGORIAS_GASTO = [
  { id: 'fijos_vivienda', nombre: 'Fijos Vivienda', emoji: '🏠', color: '#E8B4B8' },
  { id: 'alimentacion', nombre: 'Alimentación', emoji: '🍽️', color: '#F4A261' },
  { id: 'transporte', nombre: 'Transporte', emoji: '🚌', color: '#2A9D8F' },
  { id: 'casa_padres', nombre: 'Casa Padres', emoji: '👨‍👩‍👧', color: '#E76F51' },
  { id: 'salud', nombre: 'Salud', emoji: '💊', color: '#06A77D' },
  { id: 'aseo_personal', nombre: 'Aseo Personal', emoji: '🧴', color: '#9D4EDD' },
  { id: 'mascota', nombre: 'Mascota', emoji: '🐾', color: '#D4A373' },
  { id: 'educacion', nombre: 'Educación', emoji: '📚', color: '#3A86FF' },
  { id: 'servicios_digitales', nombre: 'Servicios Digitales', emoji: '📱', color: '#8338EC' },
  { id: 'inversion', nombre: 'Inversión', emoji: '📈', color: '#06D6A0' },
  { id: 'ahorro', nombre: 'Ahorro', emoji: '💰', color: '#FFD60A' },
  { id: 'deuda', nombre: 'Deuda', emoji: '💳', color: '#EF233C' },
  { id: 'cumpleanos', nombre: 'Cumpleaños', emoji: '🎂', color: '#FF006E' },
  { id: 'otros', nombre: 'Otros', emoji: '📦', color: '#8D99AE' },
];

const DEFAULT_CATEGORIAS_INGRESO = [
  { id: 'salario', nombre: 'Salario', emoji: '💼', color: '#06A77D' },
  { id: 'cts', nombre: 'CTS', emoji: '🏦', color: '#3A86FF' },
  { id: 'gratificacion', nombre: 'Gratificación', emoji: '🎁', color: '#FF006E' },
  { id: 'extra', nombre: 'Ingreso Extra', emoji: '✨', color: '#FFD60A' },
  { id: 'utilidades', nombre: 'Utilidades', emoji: '💵', color: '#06D6A0' },
];

const DEFAULT_CONFIG = {
  diaInicioMes: 23,
  ajustarFinDeSemana: true,
  moneda: 'S/.',
  persona: 'Sanat',
};


// ============ DATOS PRE-CARGADOS DE SANAT (desde Google Sheet) ============
const SEED_DATA = [{"id":"seed_0001","tipo":"ingreso","tipoRegistro":"proyectado","categoria":"salario","subcategoria":"","detalle":"Auna","monto":3000.0,"fecha":"2026-04-23","persona":"Sanat","grupoId":"seedgrp_001"},{"id":"seed_0002","tipo":"ingreso","tipoRegistro":"proyectado","categoria":"salario","subcategoria":"","detalle":"Auna","monto":3000.0,"fecha":"2026-05-23","persona":"Sanat","grupoId":"seedgrp_001"},{"id":"seed_0003","tipo":"ingreso","tipoRegistro":"proyectado","categoria":"salario","subcategoria":"","detalle":"Auna","monto":3000.0,"fecha":"2026-06-23","persona":"Sanat","grupoId":"seedgrp_001"},{"id":"seed_0004","tipo":"ingreso","tipoRegistro":"proyectado","categoria":"salario","subcategoria":"","detalle":"Auna","monto":3000.0,"fecha":"2026-07-23","persona":"Sanat","grupoId":"seedgrp_001"},{"id":"seed_0005","tipo":"ingreso","tipoRegistro":"proyectado","categoria":"salario","subcategoria":"","detalle":"Auna","monto":3000.0,"fecha":"2026-08-23","persona":"Sanat","grupoId":"seedgrp_001"},{"id":"seed_0006","tipo":"ingreso","tipoRegistro":"proyectado","categoria":"salario","subcategoria":"","detalle":"Auna","monto":3000.0,"fecha":"2026-09-23","persona":"Sanat","grupoId":"seedgrp_001"},{"id":"seed_0007","tipo":"ingreso","tipoRegistro":"proyectado","categoria":"salario","subcategoria":"","detalle":"Auna","monto":3000.0,"fecha":"2026-10-23","persona":"Sanat","grupoId":"seedgrp_001"},{"id":"seed_0008","tipo":"ingreso","tipoRegistro":"proyectado","categoria":"salario","subcategoria":"","detalle":"Auna","monto":3000.0,"fecha":"2026-11-23","persona":"Sanat","grupoId":"seedgrp_001"},{"id":"seed_0009","tipo":"ingreso","tipoRegistro":"proyectado","categoria":"salario","subcategoria":"","detalle":"Auna","monto":3000.0,"fecha":"2026-12-23","persona":"Sanat","grupoId":"seedgrp_001"},{"id":"seed_0010","tipo":"ingreso","tipoRegistro":"proyectado","categoria":"salario","subcategoria":"","detalle":"Auna","monto":3000.0,"fecha":"2027-01-23","persona":"Sanat","grupoId":"seedgrp_001"},{"id":"seed_0011","tipo":"ingreso","tipoRegistro":"proyectado","categoria":"salario","subcategoria":"","detalle":"Auna","monto":3000.0,"fecha":"2027-02-23","persona":"Sanat","grupoId":"seedgrp_001"},{"id":"seed_0012","tipo":"ingreso","tipoRegistro":"proyectado","categoria":"salario","subcategoria":"","detalle":"Auna","monto":3000.0,"fecha":"2027-03-23","persona":"Sanat","grupoId":"seedgrp_001"},{"id":"seed_0013","tipo":"ingreso","tipoRegistro":"real","categoria":"salario","subcategoria":"","detalle":"Auna","monto":3000.0,"fecha":"2026-03-23","persona":"Sanat","grupoId":null},{"id":"seed_0014","tipo":"ingreso","tipoRegistro":"proyectado","categoria":"cts","subcategoria":"","detalle":"Auna","monto":2000.0,"fecha":"2026-05-15","persona":"Sanat","grupoId":"seedgrp_002"},{"id":"seed_0015","tipo":"ingreso","tipoRegistro":"proyectado","categoria":"cts","subcategoria":"","detalle":"Auna","monto":2000.0,"fecha":"2026-11-13","persona":"Sanat","grupoId":"seedgrp_002"},{"id":"seed_0016","tipo":"ingreso","tipoRegistro":"proyectado","categoria":"gratificacion","subcategoria":"","detalle":"Auna","monto":3800.0,"fecha":"2026-07-23","persona":"Sanat","grupoId":"seedgrp_003"},{"id":"seed_0017","tipo":"ingreso","tipoRegistro":"proyectado","categoria":"gratificacion","subcategoria":"","detalle":"Auna","monto":3800.0,"fecha":"2026-12-23","persona":"Sanat","grupoId":"seedgrp_003"},{"id":"seed_0018","tipo":"ingreso","tipoRegistro":"proyectado","categoria":"gratificacion","subcategoria":"Aguinaldo","detalle":"Auna","monto":200.0,"fecha":"2026-12-23","persona":"Sanat","grupoId":null},{"id":"seed_0019","tipo":"gasto","tipoRegistro":"proyectado","categoria":"fijos_vivienda","subcategoria":"Servicios","detalle":"Agua","monto":50.0,"fecha":"2026-03-30","persona":"Sanat","grupoId":"seedgrp_004"},{"id":"seed_0020","tipo":"gasto","tipoRegistro":"proyectado","categoria":"fijos_vivienda","subcategoria":"Servicios","detalle":"Agua","monto":50.0,"fecha":"2026-04-30","persona":"Sanat","grupoId":"seedgrp_004"},{"id":"seed_0021","tipo":"gasto","tipoRegistro":"proyectado","categoria":"fijos_vivienda","subcategoria":"Servicios","detalle":"Agua","monto":50.0,"fecha":"2026-05-30","persona":"Sanat","grupoId":"seedgrp_004"},{"id":"seed_0022","tipo":"gasto","tipoRegistro":"proyectado","categoria":"fijos_vivienda","subcategoria":"Servicios","detalle":"Agua","monto":50.0,"fecha":"2026-06-30","persona":"Sanat","grupoId":"seedgrp_004"},{"id":"seed_0023","tipo":"gasto","tipoRegistro":"proyectado","categoria":"fijos_vivienda","subcategoria":"Servicios","detalle":"Agua","monto":50.0,"fecha":"2026-07-30","persona":"Sanat","grupoId":"seedgrp_004"},{"id":"seed_0024","tipo":"gasto","tipoRegistro":"proyectado","categoria":"fijos_vivienda","subcategoria":"Servicios","detalle":"Agua","monto":50.0,"fecha":"2026-08-30","persona":"Sanat","grupoId":"seedgrp_004"},{"id":"seed_0025","tipo":"gasto","tipoRegistro":"proyectado","categoria":"fijos_vivienda","subcategoria":"Servicios","detalle":"Agua","monto":50.0,"fecha":"2026-09-30","persona":"Sanat","grupoId":"seedgrp_004"},{"id":"seed_0026","tipo":"gasto","tipoRegistro":"proyectado","categoria":"fijos_vivienda","subcategoria":"Servicios","detalle":"Agua","monto":50.0,"fecha":"2026-10-30","persona":"Sanat","grupoId":"seedgrp_004"},{"id":"seed_0027","tipo":"gasto","tipoRegistro":"proyectado","categoria":"fijos_vivienda","subcategoria":"Servicios","detalle":"Agua","monto":50.0,"fecha":"2026-11-30","persona":"Sanat","grupoId":"seedgrp_004"},{"id":"seed_0028","tipo":"gasto","tipoRegistro":"proyectado","categoria":"fijos_vivienda","subcategoria":"Servicios","detalle":"Agua","monto":50.0,"fecha":"2026-12-30","persona":"Sanat","grupoId":"seedgrp_004"},{"id":"seed_0029","tipo":"gasto","tipoRegistro":"proyectado","categoria":"fijos_vivienda","subcategoria":"Servicios","detalle":"Agua","monto":50.0,"fecha":"2027-01-30","persona":"Sanat","grupoId":"seedgrp_004"},{"id":"seed_0030","tipo":"gasto","tipoRegistro":"proyectado","categoria":"fijos_vivienda","subcategoria":"Servicios","detalle":"Agua","monto":50.0,"fecha":"2027-02-28","persona":"Sanat","grupoId":"seedgrp_004"},{"id":"seed_0031","tipo":"gasto","tipoRegistro":"proyectado","categoria":"alimentacion","subcategoria":"Comida Casa","detalle":"Dinero","monto":450.0,"fecha":"2026-03-24","persona":"Sanat","grupoId":"seedgrp_005"},{"id":"seed_0032","tipo":"gasto","tipoRegistro":"proyectado","categoria":"alimentacion","subcategoria":"Comida Casa","detalle":"Dinero","monto":450.0,"fecha":"2026-04-24","persona":"Sanat","grupoId":"seedgrp_005"},{"id":"seed_0033","tipo":"gasto","tipoRegistro":"proyectado","categoria":"alimentacion","subcategoria":"Comida Casa","detalle":"Dinero","monto":450.0,"fecha":"2026-05-24","persona":"Sanat","grupoId":"seedgrp_005"},{"id":"seed_0034","tipo":"gasto","tipoRegistro":"proyectado","categoria":"alimentacion","subcategoria":"Comida Casa","detalle":"Dinero","monto":450.0,"fecha":"2026-06-24","persona":"Sanat","grupoId":"seedgrp_005"},{"id":"seed_0035","tipo":"gasto","tipoRegistro":"proyectado","categoria":"alimentacion","subcategoria":"Comida Casa","detalle":"Dinero","monto":450.0,"fecha":"2026-07-24","persona":"Sanat","grupoId":"seedgrp_005"},{"id":"seed_0036","tipo":"gasto","tipoRegistro":"proyectado","categoria":"alimentacion","subcategoria":"Comida Casa","detalle":"Dinero","monto":450.0,"fecha":"2026-08-24","persona":"Sanat","grupoId":"seedgrp_005"},{"id":"seed_0037","tipo":"gasto","tipoRegistro":"proyectado","categoria":"alimentacion","subcategoria":"Comida Casa","detalle":"Dinero","monto":450.0,"fecha":"2026-09-24","persona":"Sanat","grupoId":"seedgrp_005"},{"id":"seed_0038","tipo":"gasto","tipoRegistro":"proyectado","categoria":"alimentacion","subcategoria":"Comida Casa","detalle":"Dinero","monto":450.0,"fecha":"2026-10-24","persona":"Sanat","grupoId":"seedgrp_005"},{"id":"seed_0039","tipo":"gasto","tipoRegistro":"proyectado","categoria":"alimentacion","subcategoria":"Comida Casa","detalle":"Dinero","monto":450.0,"fecha":"2026-11-24","persona":"Sanat","grupoId":"seedgrp_005"},{"id":"seed_0040","tipo":"gasto","tipoRegistro":"proyectado","categoria":"alimentacion","subcategoria":"Comida Casa","detalle":"Dinero","monto":450.0,"fecha":"2026-12-24","persona":"Sanat","grupoId":"seedgrp_005"},{"id":"seed_0041","tipo":"gasto","tipoRegistro":"proyectado","categoria":"alimentacion","subcategoria":"Comida Casa","detalle":"Dinero","monto":450.0,"fecha":"2027-01-24","persona":"Sanat","grupoId":"seedgrp_005"},{"id":"seed_0042","tipo":"gasto","tipoRegistro":"proyectado","categoria":"alimentacion","subcategoria":"Comida Casa","detalle":"Dinero","monto":450.0,"fecha":"2027-02-24","persona":"Sanat","grupoId":"seedgrp_005"},{"id":"seed_0043","tipo":"gasto","tipoRegistro":"real","categoria":"casa_padres","subcategoria":"Comida","detalle":"Alimento","monto":20.0,"fecha":"2026-03-26","persona":"Sanat","grupoId":null},{"id":"seed_0044","tipo":"gasto","tipoRegistro":"proyectado","categoria":"ahorro","subcategoria":"Ahorro Carro","detalle":"Segunda Toyota","monto":400.0,"fecha":"2026-04-24","persona":"Sanat","grupoId":"seedgrp_006"},{"id":"seed_0045","tipo":"gasto","tipoRegistro":"proyectado","categoria":"ahorro","subcategoria":"Ahorro Carro","detalle":"Segunda Toyota","monto":400.0,"fecha":"2026-05-24","persona":"Sanat","grupoId":"seedgrp_006"},{"id":"seed_0046","tipo":"gasto","tipoRegistro":"proyectado","categoria":"ahorro","subcategoria":"Ahorro Carro","detalle":"Segunda Toyota","monto":400.0,"fecha":"2026-06-24","persona":"Sanat","grupoId":"seedgrp_006"},{"id":"seed_0047","tipo":"gasto","tipoRegistro":"proyectado","categoria":"ahorro","subcategoria":"Ahorro Carro","detalle":"Segunda Toyota","monto":400.0,"fecha":"2026-07-24","persona":"Sanat","grupoId":"seedgrp_006"},{"id":"seed_0048","tipo":"gasto","tipoRegistro":"proyectado","categoria":"ahorro","subcategoria":"Ahorro Carro","detalle":"Segunda Toyota","monto":400.0,"fecha":"2026-08-24","persona":"Sanat","grupoId":"seedgrp_006"},{"id":"seed_0049","tipo":"gasto","tipoRegistro":"proyectado","categoria":"ahorro","subcategoria":"Ahorro Carro","detalle":"Segunda Toyota","monto":400.0,"fecha":"2026-09-24","persona":"Sanat","grupoId":"seedgrp_006"},{"id":"seed_0050","tipo":"gasto","tipoRegistro":"proyectado","categoria":"ahorro","subcategoria":"Ahorro Carro","detalle":"Segunda Toyota","monto":400.0,"fecha":"2026-10-24","persona":"Sanat","grupoId":"seedgrp_006"},{"id":"seed_0051","tipo":"gasto","tipoRegistro":"proyectado","categoria":"ahorro","subcategoria":"Ahorro Carro","detalle":"Segunda Toyota","monto":400.0,"fecha":"2026-11-24","persona":"Sanat","grupoId":"seedgrp_006"},{"id":"seed_0052","tipo":"gasto","tipoRegistro":"proyectado","categoria":"ahorro","subcategoria":"Ahorro Carro","detalle":"Segunda Toyota","monto":400.0,"fecha":"2026-12-24","persona":"Sanat","grupoId":"seedgrp_006"},{"id":"seed_0053","tipo":"gasto","tipoRegistro":"proyectado","categoria":"ahorro","subcategoria":"Ahorro Carro","detalle":"Segunda Toyota","monto":400.0,"fecha":"2027-01-24","persona":"Sanat","grupoId":"seedgrp_006"},{"id":"seed_0054","tipo":"gasto","tipoRegistro":"proyectado","categoria":"ahorro","subcategoria":"Ahorro Carro","detalle":"Segunda Toyota","monto":400.0,"fecha":"2027-02-24","persona":"Sanat","grupoId":"seedgrp_006"},{"id":"seed_0055","tipo":"gasto","tipoRegistro":"proyectado","categoria":"ahorro","subcategoria":"Ahorro Carro","detalle":"Segunda Toyota","monto":400.0,"fecha":"2027-03-24","persona":"Sanat","grupoId":"seedgrp_006"},{"id":"seed_0056","tipo":"gasto","tipoRegistro":"proyectado","categoria":"inversion","subcategoria":"Lovable","detalle":"","monto":200.0,"fecha":"2026-04-23","persona":"Sanat","grupoId":"seedgrp_007"},{"id":"seed_0057","tipo":"gasto","tipoRegistro":"proyectado","categoria":"inversion","subcategoria":"Lovable","detalle":"","monto":200.0,"fecha":"2026-05-23","persona":"Sanat","grupoId":"seedgrp_007"},{"id":"seed_0058","tipo":"gasto","tipoRegistro":"proyectado","categoria":"inversion","subcategoria":"Lovable","detalle":"","monto":200.0,"fecha":"2026-06-23","persona":"Sanat","grupoId":"seedgrp_007"},{"id":"seed_0059","tipo":"gasto","tipoRegistro":"proyectado","categoria":"inversion","subcategoria":"Lovable","detalle":"","monto":200.0,"fecha":"2026-07-23","persona":"Sanat","grupoId":"seedgrp_007"},{"id":"seed_0060","tipo":"gasto","tipoRegistro":"proyectado","categoria":"inversion","subcategoria":"Lovable","detalle":"","monto":200.0,"fecha":"2026-08-23","persona":"Sanat","grupoId":"seedgrp_007"},{"id":"seed_0061","tipo":"gasto","tipoRegistro":"proyectado","categoria":"inversion","subcategoria":"Lovable","detalle":"","monto":200.0,"fecha":"2026-09-23","persona":"Sanat","grupoId":"seedgrp_007"},{"id":"seed_0062","tipo":"gasto","tipoRegistro":"proyectado","categoria":"inversion","subcategoria":"Lovable","detalle":"","monto":200.0,"fecha":"2026-10-23","persona":"Sanat","grupoId":"seedgrp_007"},{"id":"seed_0063","tipo":"gasto","tipoRegistro":"proyectado","categoria":"inversion","subcategoria":"Lovable","detalle":"","monto":200.0,"fecha":"2026-11-23","persona":"Sanat","grupoId":"seedgrp_007"},{"id":"seed_0064","tipo":"gasto","tipoRegistro":"proyectado","categoria":"inversion","subcategoria":"Lovable","detalle":"","monto":200.0,"fecha":"2026-12-23","persona":"Sanat","grupoId":"seedgrp_007"},{"id":"seed_0065","tipo":"gasto","tipoRegistro":"proyectado","categoria":"inversion","subcategoria":"Lovable","detalle":"","monto":200.0,"fecha":"2027-01-23","persona":"Sanat","grupoId":"seedgrp_007"},{"id":"seed_0066","tipo":"gasto","tipoRegistro":"proyectado","categoria":"inversion","subcategoria":"Lovable","detalle":"","monto":200.0,"fecha":"2027-02-23","persona":"Sanat","grupoId":"seedgrp_007"},{"id":"seed_0067","tipo":"gasto","tipoRegistro":"proyectado","categoria":"inversion","subcategoria":"Lovable","detalle":"","monto":200.0,"fecha":"2027-03-23","persona":"Sanat","grupoId":"seedgrp_007"},{"id":"seed_0068","tipo":"gasto","tipoRegistro":"real","categoria":"casa_padres","subcategoria":"Servicios","detalle":"Luz 654822","monto":328.4,"fecha":"2026-03-24","persona":"Sanat","grupoId":null},{"id":"seed_0069","tipo":"gasto","tipoRegistro":"proyectado","categoria":"casa_padres","subcategoria":"Mamá","detalle":"Luz 654822","monto":300.0,"fecha":"2026-03-23","persona":"Sanat","grupoId":"seedgrp_008"},{"id":"seed_0070","tipo":"gasto","tipoRegistro":"proyectado","categoria":"casa_padres","subcategoria":"Mamá","detalle":"Luz 654822","monto":300.0,"fecha":"2026-04-23","persona":"Sanat","grupoId":"seedgrp_008"},{"id":"seed_0071","tipo":"gasto","tipoRegistro":"proyectado","categoria":"casa_padres","subcategoria":"Mamá","detalle":"Luz 654822","monto":300.0,"fecha":"2026-05-23","persona":"Sanat","grupoId":"seedgrp_008"},{"id":"seed_0072","tipo":"gasto","tipoRegistro":"proyectado","categoria":"casa_padres","subcategoria":"Mamá","detalle":"Luz 654822","monto":300.0,"fecha":"2026-06-23","persona":"Sanat","grupoId":"seedgrp_008"},{"id":"seed_0073","tipo":"gasto","tipoRegistro":"proyectado","categoria":"casa_padres","subcategoria":"Mamá","detalle":"Luz 654822","monto":300.0,"fecha":"2026-07-23","persona":"Sanat","grupoId":"seedgrp_008"},{"id":"seed_0074","tipo":"gasto","tipoRegistro":"proyectado","categoria":"casa_padres","subcategoria":"Mamá","detalle":"Luz 654822","monto":300.0,"fecha":"2026-08-23","persona":"Sanat","grupoId":"seedgrp_008"},{"id":"seed_0075","tipo":"gasto","tipoRegistro":"proyectado","categoria":"casa_padres","subcategoria":"Mamá","detalle":"Luz 654822","monto":300.0,"fecha":"2026-09-23","persona":"Sanat","grupoId":"seedgrp_008"},{"id":"seed_0076","tipo":"gasto","tipoRegistro":"proyectado","categoria":"casa_padres","subcategoria":"Mamá","detalle":"Luz 654822","monto":300.0,"fecha":"2026-10-23","persona":"Sanat","grupoId":"seedgrp_008"},{"id":"seed_0077","tipo":"gasto","tipoRegistro":"proyectado","categoria":"casa_padres","subcategoria":"Mamá","detalle":"Luz 654822","monto":300.0,"fecha":"2026-11-23","persona":"Sanat","grupoId":"seedgrp_008"},{"id":"seed_0078","tipo":"gasto","tipoRegistro":"proyectado","categoria":"casa_padres","subcategoria":"Mamá","detalle":"Luz 654822","monto":300.0,"fecha":"2026-12-23","persona":"Sanat","grupoId":"seedgrp_008"},{"id":"seed_0079","tipo":"gasto","tipoRegistro":"proyectado","categoria":"casa_padres","subcategoria":"Mamá","detalle":"Luz 654822","monto":300.0,"fecha":"2027-01-23","persona":"Sanat","grupoId":"seedgrp_008"},{"id":"seed_0080","tipo":"gasto","tipoRegistro":"proyectado","categoria":"casa_padres","subcategoria":"Mamá","detalle":"Luz 654822","monto":300.0,"fecha":"2027-02-23","persona":"Sanat","grupoId":"seedgrp_008"},{"id":"seed_0081","tipo":"gasto","tipoRegistro":"proyectado","categoria":"transporte","subcategoria":"Varios","detalle":"Bus/Tren/Taxi","monto":200.0,"fecha":"2026-03-23","persona":"Sanat","grupoId":"seedgrp_009"},{"id":"seed_0082","tipo":"gasto","tipoRegistro":"proyectado","categoria":"transporte","subcategoria":"Varios","detalle":"Bus/Tren/Taxi","monto":200.0,"fecha":"2026-04-23","persona":"Sanat","grupoId":"seedgrp_009"},{"id":"seed_0083","tipo":"gasto","tipoRegistro":"proyectado","categoria":"transporte","subcategoria":"Varios","detalle":"Bus/Tren/Taxi","monto":200.0,"fecha":"2026-05-23","persona":"Sanat","grupoId":"seedgrp_009"},{"id":"seed_0084","tipo":"gasto","tipoRegistro":"proyectado","categoria":"transporte","subcategoria":"Varios","detalle":"Bus/Tren/Taxi","monto":200.0,"fecha":"2026-06-23","persona":"Sanat","grupoId":"seedgrp_009"},{"id":"seed_0085","tipo":"gasto","tipoRegistro":"proyectado","categoria":"transporte","subcategoria":"Varios","detalle":"Bus/Tren/Taxi","monto":200.0,"fecha":"2026-07-23","persona":"Sanat","grupoId":"seedgrp_009"},{"id":"seed_0086","tipo":"gasto","tipoRegistro":"proyectado","categoria":"transporte","subcategoria":"Varios","detalle":"Bus/Tren/Taxi","monto":200.0,"fecha":"2026-08-23","persona":"Sanat","grupoId":"seedgrp_009"},{"id":"seed_0087","tipo":"gasto","tipoRegistro":"proyectado","categoria":"transporte","subcategoria":"Varios","detalle":"Bus/Tren/Taxi","monto":200.0,"fecha":"2026-09-23","persona":"Sanat","grupoId":"seedgrp_009"},{"id":"seed_0088","tipo":"gasto","tipoRegistro":"proyectado","categoria":"transporte","subcategoria":"Varios","detalle":"Bus/Tren/Taxi","monto":200.0,"fecha":"2026-10-23","persona":"Sanat","grupoId":"seedgrp_009"},{"id":"seed_0089","tipo":"gasto","tipoRegistro":"proyectado","categoria":"transporte","subcategoria":"Varios","detalle":"Bus/Tren/Taxi","monto":200.0,"fecha":"2026-11-23","persona":"Sanat","grupoId":"seedgrp_009"},{"id":"seed_0090","tipo":"gasto","tipoRegistro":"proyectado","categoria":"transporte","subcategoria":"Varios","detalle":"Bus/Tren/Taxi","monto":200.0,"fecha":"2026-12-23","persona":"Sanat","grupoId":"seedgrp_009"},{"id":"seed_0091","tipo":"gasto","tipoRegistro":"proyectado","categoria":"transporte","subcategoria":"Varios","detalle":"Bus/Tren/Taxi","monto":200.0,"fecha":"2027-01-23","persona":"Sanat","grupoId":"seedgrp_009"},{"id":"seed_0092","tipo":"gasto","tipoRegistro":"proyectado","categoria":"transporte","subcategoria":"Varios","detalle":"Bus/Tren/Taxi","monto":200.0,"fecha":"2027-02-23","persona":"Sanat","grupoId":"seedgrp_009"},{"id":"seed_0093","tipo":"gasto","tipoRegistro":"real","categoria":"alimentacion","subcategoria":"Comida Casa","detalle":"Dinero","monto":450.0,"fecha":"2026-03-24","persona":"Sanat","grupoId":null},{"id":"seed_0094","tipo":"gasto","tipoRegistro":"proyectado","categoria":"otros","subcategoria":"Salida Familiar","detalle":"","monto":200.0,"fecha":"2026-03-23","persona":"Sanat","grupoId":"seedgrp_010"},{"id":"seed_0095","tipo":"gasto","tipoRegistro":"proyectado","categoria":"otros","subcategoria":"Salida Familiar","detalle":"","monto":200.0,"fecha":"2026-04-23","persona":"Sanat","grupoId":"seedgrp_010"},{"id":"seed_0096","tipo":"gasto","tipoRegistro":"proyectado","categoria":"otros","subcategoria":"Salida Familiar","detalle":"","monto":200.0,"fecha":"2026-05-23","persona":"Sanat","grupoId":"seedgrp_010"},{"id":"seed_0097","tipo":"gasto","tipoRegistro":"proyectado","categoria":"otros","subcategoria":"Salida Familiar","detalle":"","monto":200.0,"fecha":"2026-06-23","persona":"Sanat","grupoId":"seedgrp_010"},{"id":"seed_0098","tipo":"gasto","tipoRegistro":"proyectado","categoria":"otros","subcategoria":"Salida Familiar","detalle":"","monto":200.0,"fecha":"2026-07-23","persona":"Sanat","grupoId":"seedgrp_010"},{"id":"seed_0099","tipo":"gasto","tipoRegistro":"proyectado","categoria":"otros","subcategoria":"Salida Familiar","detalle":"","monto":200.0,"fecha":"2026-08-23","persona":"Sanat","grupoId":"seedgrp_010"},{"id":"seed_0100","tipo":"gasto","tipoRegistro":"proyectado","categoria":"otros","subcategoria":"Salida Familiar","detalle":"","monto":200.0,"fecha":"2026-09-23","persona":"Sanat","grupoId":"seedgrp_010"},{"id":"seed_0101","tipo":"gasto","tipoRegistro":"proyectado","categoria":"otros","subcategoria":"Salida Familiar","detalle":"","monto":200.0,"fecha":"2026-10-23","persona":"Sanat","grupoId":"seedgrp_010"},{"id":"seed_0102","tipo":"gasto","tipoRegistro":"proyectado","categoria":"otros","subcategoria":"Salida Familiar","detalle":"","monto":200.0,"fecha":"2026-11-23","persona":"Sanat","grupoId":"seedgrp_010"},{"id":"seed_0103","tipo":"gasto","tipoRegistro":"proyectado","categoria":"otros","subcategoria":"Salida Familiar","detalle":"","monto":200.0,"fecha":"2026-12-23","persona":"Sanat","grupoId":"seedgrp_010"},{"id":"seed_0104","tipo":"gasto","tipoRegistro":"proyectado","categoria":"otros","subcategoria":"Salida Familiar","detalle":"","monto":200.0,"fecha":"2027-01-23","persona":"Sanat","grupoId":"seedgrp_010"},{"id":"seed_0105","tipo":"gasto","tipoRegistro":"proyectado","categoria":"otros","subcategoria":"Salida Familiar","detalle":"","monto":200.0,"fecha":"2027-02-23","persona":"Sanat","grupoId":"seedgrp_010"},{"id":"seed_0106","tipo":"gasto","tipoRegistro":"real","categoria":"fijos_vivienda","subcategoria":"Servicios","detalle":"Agua","monto":60.0,"fecha":"2026-04-08","persona":"Sanat","grupoId":null},{"id":"seed_0107","tipo":"gasto","tipoRegistro":"proyectado","categoria":"casa_padres","subcategoria":"Comida","detalle":"Alimento","monto":60.0,"fecha":"2026-03-25","persona":"Sanat","grupoId":"seedgrp_011"},{"id":"seed_0108","tipo":"gasto","tipoRegistro":"proyectado","categoria":"casa_padres","subcategoria":"Comida","detalle":"Alimento","monto":60.0,"fecha":"2026-04-25","persona":"Sanat","grupoId":"seedgrp_011"},{"id":"seed_0109","tipo":"gasto","tipoRegistro":"proyectado","categoria":"casa_padres","subcategoria":"Comida","detalle":"Alimento","monto":60.0,"fecha":"2026-05-25","persona":"Sanat","grupoId":"seedgrp_011"},{"id":"seed_0110","tipo":"gasto","tipoRegistro":"proyectado","categoria":"casa_padres","subcategoria":"Comida","detalle":"Alimento","monto":60.0,"fecha":"2026-06-25","persona":"Sanat","grupoId":"seedgrp_011"},{"id":"seed_0111","tipo":"gasto","tipoRegistro":"proyectado","categoria":"casa_padres","subcategoria":"Comida","detalle":"Alimento","monto":60.0,"fecha":"2026-07-25","persona":"Sanat","grupoId":"seedgrp_011"},{"id":"seed_0112","tipo":"gasto","tipoRegistro":"proyectado","categoria":"casa_padres","subcategoria":"Comida","detalle":"Alimento","monto":60.0,"fecha":"2026-08-25","persona":"Sanat","grupoId":"seedgrp_011"},{"id":"seed_0113","tipo":"gasto","tipoRegistro":"proyectado","categoria":"casa_padres","subcategoria":"Comida","detalle":"Alimento","monto":60.0,"fecha":"2026-09-25","persona":"Sanat","grupoId":"seedgrp_011"},{"id":"seed_0114","tipo":"gasto","tipoRegistro":"proyectado","categoria":"casa_padres","subcategoria":"Comida","detalle":"Alimento","monto":60.0,"fecha":"2026-10-25","persona":"Sanat","grupoId":"seedgrp_011"},{"id":"seed_0115","tipo":"gasto","tipoRegistro":"proyectado","categoria":"casa_padres","subcategoria":"Comida","detalle":"Alimento","monto":60.0,"fecha":"2026-11-25","persona":"Sanat","grupoId":"seedgrp_011"},{"id":"seed_0116","tipo":"gasto","tipoRegistro":"proyectado","categoria":"casa_padres","subcategoria":"Comida","detalle":"Alimento","monto":60.0,"fecha":"2026-12-25","persona":"Sanat","grupoId":"seedgrp_011"},{"id":"seed_0117","tipo":"gasto","tipoRegistro":"proyectado","categoria":"casa_padres","subcategoria":"Comida","detalle":"Alimento","monto":60.0,"fecha":"2027-01-25","persona":"Sanat","grupoId":"seedgrp_011"},{"id":"seed_0118","tipo":"gasto","tipoRegistro":"proyectado","categoria":"casa_padres","subcategoria":"Comida","detalle":"Alimento","monto":60.0,"fecha":"2027-02-25","persona":"Sanat","grupoId":"seedgrp_011"},{"id":"seed_0119","tipo":"gasto","tipoRegistro":"proyectado","categoria":"fijos_vivienda","subcategoria":"Servicios","detalle":"Internet","monto":60.0,"fecha":"2026-04-10","persona":"Sanat","grupoId":"seedgrp_012"},{"id":"seed_0120","tipo":"gasto","tipoRegistro":"proyectado","categoria":"fijos_vivienda","subcategoria":"Servicios","detalle":"Internet","monto":60.0,"fecha":"2026-05-10","persona":"Sanat","grupoId":"seedgrp_012"},{"id":"seed_0121","tipo":"gasto","tipoRegistro":"proyectado","categoria":"fijos_vivienda","subcategoria":"Servicios","detalle":"Internet","monto":60.0,"fecha":"2026-06-10","persona":"Sanat","grupoId":"seedgrp_012"},{"id":"seed_0122","tipo":"gasto","tipoRegistro":"proyectado","categoria":"fijos_vivienda","subcategoria":"Servicios","detalle":"Internet","monto":60.0,"fecha":"2026-07-10","persona":"Sanat","grupoId":"seedgrp_012"},{"id":"seed_0123","tipo":"gasto","tipoRegistro":"proyectado","categoria":"fijos_vivienda","subcategoria":"Servicios","detalle":"Internet","monto":60.0,"fecha":"2026-08-10","persona":"Sanat","grupoId":"seedgrp_012"},{"id":"seed_0124","tipo":"gasto","tipoRegistro":"proyectado","categoria":"fijos_vivienda","subcategoria":"Servicios","detalle":"Internet","monto":60.0,"fecha":"2026-09-10","persona":"Sanat","grupoId":"seedgrp_012"},{"id":"seed_0125","tipo":"gasto","tipoRegistro":"proyectado","categoria":"fijos_vivienda","subcategoria":"Servicios","detalle":"Internet","monto":60.0,"fecha":"2026-10-10","persona":"Sanat","grupoId":"seedgrp_012"},{"id":"seed_0126","tipo":"gasto","tipoRegistro":"proyectado","categoria":"fijos_vivienda","subcategoria":"Servicios","detalle":"Internet","monto":60.0,"fecha":"2026-11-10","persona":"Sanat","grupoId":"seedgrp_012"},{"id":"seed_0127","tipo":"gasto","tipoRegistro":"proyectado","categoria":"fijos_vivienda","subcategoria":"Servicios","detalle":"Internet","monto":60.0,"fecha":"2026-12-10","persona":"Sanat","grupoId":"seedgrp_012"},{"id":"seed_0128","tipo":"gasto","tipoRegistro":"proyectado","categoria":"fijos_vivienda","subcategoria":"Servicios","detalle":"Internet","monto":60.0,"fecha":"2027-01-10","persona":"Sanat","grupoId":"seedgrp_012"},{"id":"seed_0129","tipo":"gasto","tipoRegistro":"proyectado","categoria":"fijos_vivienda","subcategoria":"Servicios","detalle":"Internet","monto":60.0,"fecha":"2027-02-10","persona":"Sanat","grupoId":"seedgrp_012"},{"id":"seed_0130","tipo":"gasto","tipoRegistro":"proyectado","categoria":"fijos_vivienda","subcategoria":"Servicios","detalle":"Internet","monto":60.0,"fecha":"2027-03-10","persona":"Sanat","grupoId":"seedgrp_012"},{"id":"seed_0131","tipo":"gasto","tipoRegistro":"proyectado","categoria":"fijos_vivienda","subcategoria":"Servicios","detalle":"Luz","monto":90.0,"fecha":"2026-03-30","persona":"Sanat","grupoId":"seedgrp_013"},{"id":"seed_0132","tipo":"gasto","tipoRegistro":"proyectado","categoria":"fijos_vivienda","subcategoria":"Servicios","detalle":"Luz","monto":90.0,"fecha":"2026-04-30","persona":"Sanat","grupoId":"seedgrp_013"},{"id":"seed_0133","tipo":"gasto","tipoRegistro":"proyectado","categoria":"fijos_vivienda","subcategoria":"Servicios","detalle":"Luz","monto":90.0,"fecha":"2026-05-30","persona":"Sanat","grupoId":"seedgrp_013"},{"id":"seed_0134","tipo":"gasto","tipoRegistro":"proyectado","categoria":"fijos_vivienda","subcategoria":"Servicios","detalle":"Luz","monto":90.0,"fecha":"2026-06-30","persona":"Sanat","grupoId":"seedgrp_013"},{"id":"seed_0135","tipo":"gasto","tipoRegistro":"proyectado","categoria":"fijos_vivienda","subcategoria":"Servicios","detalle":"Luz","monto":90.0,"fecha":"2026-07-30","persona":"Sanat","grupoId":"seedgrp_013"},{"id":"seed_0136","tipo":"gasto","tipoRegistro":"proyectado","categoria":"fijos_vivienda","subcategoria":"Servicios","detalle":"Luz","monto":90.0,"fecha":"2026-08-30","persona":"Sanat","grupoId":"seedgrp_013"},{"id":"seed_0137","tipo":"gasto","tipoRegistro":"proyectado","categoria":"fijos_vivienda","subcategoria":"Servicios","detalle":"Luz","monto":90.0,"fecha":"2026-09-30","persona":"Sanat","grupoId":"seedgrp_013"},{"id":"seed_0138","tipo":"gasto","tipoRegistro":"proyectado","categoria":"fijos_vivienda","subcategoria":"Servicios","detalle":"Luz","monto":90.0,"fecha":"2026-10-30","persona":"Sanat","grupoId":"seedgrp_013"},{"id":"seed_0139","tipo":"gasto","tipoRegistro":"proyectado","categoria":"fijos_vivienda","subcategoria":"Servicios","detalle":"Luz","monto":90.0,"fecha":"2026-11-30","persona":"Sanat","grupoId":"seedgrp_013"},{"id":"seed_0140","tipo":"gasto","tipoRegistro":"proyectado","categoria":"fijos_vivienda","subcategoria":"Servicios","detalle":"Luz","monto":90.0,"fecha":"2026-12-30","persona":"Sanat","grupoId":"seedgrp_013"},{"id":"seed_0141","tipo":"gasto","tipoRegistro":"proyectado","categoria":"fijos_vivienda","subcategoria":"Servicios","detalle":"Luz","monto":90.0,"fecha":"2027-01-30","persona":"Sanat","grupoId":"seedgrp_013"},{"id":"seed_0142","tipo":"gasto","tipoRegistro":"proyectado","categoria":"fijos_vivienda","subcategoria":"Servicios","detalle":"Luz","monto":90.0,"fecha":"2027-02-28","persona":"Sanat","grupoId":"seedgrp_013"},{"id":"seed_0143","tipo":"gasto","tipoRegistro":"proyectado","categoria":"transporte","subcategoria":"Trabajo","detalle":"Bus/Tren","monto":50.0,"fecha":"2026-03-23","persona":"Sanat","grupoId":"seedgrp_014"},{"id":"seed_0144","tipo":"gasto","tipoRegistro":"proyectado","categoria":"transporte","subcategoria":"Trabajo","detalle":"Bus/Tren","monto":50.0,"fecha":"2026-04-23","persona":"Sanat","grupoId":"seedgrp_014"},{"id":"seed_0145","tipo":"gasto","tipoRegistro":"proyectado","categoria":"transporte","subcategoria":"Trabajo","detalle":"Bus/Tren","monto":50.0,"fecha":"2026-05-23","persona":"Sanat","grupoId":"seedgrp_014"},{"id":"seed_0146","tipo":"gasto","tipoRegistro":"proyectado","categoria":"transporte","subcategoria":"Trabajo","detalle":"Bus/Tren","monto":50.0,"fecha":"2026-06-23","persona":"Sanat","grupoId":"seedgrp_014"},{"id":"seed_0147","tipo":"gasto","tipoRegistro":"proyectado","categoria":"transporte","subcategoria":"Trabajo","detalle":"Bus/Tren","monto":50.0,"fecha":"2026-07-23","persona":"Sanat","grupoId":"seedgrp_014"},{"id":"seed_0148","tipo":"gasto","tipoRegistro":"proyectado","categoria":"transporte","subcategoria":"Trabajo","detalle":"Bus/Tren","monto":50.0,"fecha":"2026-08-23","persona":"Sanat","grupoId":"seedgrp_014"},{"id":"seed_0149","tipo":"gasto","tipoRegistro":"proyectado","categoria":"transporte","subcategoria":"Trabajo","detalle":"Bus/Tren","monto":50.0,"fecha":"2026-09-23","persona":"Sanat","grupoId":"seedgrp_014"},{"id":"seed_0150","tipo":"gasto","tipoRegistro":"proyectado","categoria":"transporte","subcategoria":"Trabajo","detalle":"Bus/Tren","monto":50.0,"fecha":"2026-10-23","persona":"Sanat","grupoId":"seedgrp_014"},{"id":"seed_0151","tipo":"gasto","tipoRegistro":"proyectado","categoria":"transporte","subcategoria":"Trabajo","detalle":"Bus/Tren","monto":50.0,"fecha":"2026-11-23","persona":"Sanat","grupoId":"seedgrp_014"},{"id":"seed_0152","tipo":"gasto","tipoRegistro":"proyectado","categoria":"transporte","subcategoria":"Trabajo","detalle":"Bus/Tren","monto":50.0,"fecha":"2026-12-23","persona":"Sanat","grupoId":"seedgrp_014"},{"id":"seed_0153","tipo":"gasto","tipoRegistro":"proyectado","categoria":"transporte","subcategoria":"Trabajo","detalle":"Bus/Tren","monto":50.0,"fecha":"2027-01-23","persona":"Sanat","grupoId":"seedgrp_014"},{"id":"seed_0154","tipo":"gasto","tipoRegistro":"proyectado","categoria":"transporte","subcategoria":"Trabajo","detalle":"Bus/Tren","monto":50.0,"fecha":"2027-02-23","persona":"Sanat","grupoId":"seedgrp_014"},{"id":"seed_0155","tipo":"gasto","tipoRegistro":"real","categoria":"otros","subcategoria":"Comida","detalle":"Pizza","monto":41.0,"fecha":"2026-03-23","persona":"Sanat","grupoId":null},{"id":"seed_0156","tipo":"gasto","tipoRegistro":"real","categoria":"deuda","subcategoria":"Deuda a Giuli","detalle":"prestamo","monto":210.0,"fecha":"2026-03-23","persona":"Sanat","grupoId":null},{"id":"seed_0157","tipo":"gasto","tipoRegistro":"proyectado","categoria":"deuda","subcategoria":"Deuda a Giuli","detalle":"prestamo","monto":210.0,"fecha":"2026-03-23","persona":"Sanat","grupoId":null},{"id":"seed_0158","tipo":"gasto","tipoRegistro":"real","categoria":"transporte","subcategoria":"Varios","detalle":"Bus/Tren/Taxi","monto":12.5,"fecha":"2026-03-26","persona":"Sanat","grupoId":null},{"id":"seed_0159","tipo":"gasto","tipoRegistro":"proyectado","categoria":"salud","subcategoria":"Skincare","detalle":"","monto":50.0,"fecha":"2026-04-23","persona":"Sanat","grupoId":null},{"id":"seed_0160","tipo":"gasto","tipoRegistro":"real","categoria":"salud","subcategoria":"Peluqueria","detalle":"","monto":15.0,"fecha":"2026-03-26","persona":"Sanat","grupoId":null},{"id":"seed_0161","tipo":"gasto","tipoRegistro":"proyectado","categoria":"salud","subcategoria":"Peluqueria","detalle":"","monto":50.0,"fecha":"2026-03-23","persona":"Sanat","grupoId":null},{"id":"seed_0162","tipo":"gasto","tipoRegistro":"proyectado","categoria":"ahorro","subcategoria":"Ahorro / Emergencias","detalle":"","monto":0.0,"fecha":"2026-03-24","persona":"Sanat","grupoId":null},{"id":"seed_0163","tipo":"gasto","tipoRegistro":"proyectado","categoria":"aseo_personal","subcategoria":"Aseo Personal","detalle":"Desodorante, etc","monto":50.0,"fecha":"2026-03-28","persona":"Sanat","grupoId":null},{"id":"seed_0164","tipo":"gasto","tipoRegistro":"proyectado","categoria":"mascota","subcategoria":"Gata","detalle":"Flora","monto":50.0,"fecha":"2026-03-26","persona":"Sanat","grupoId":null},{"id":"seed_0165","tipo":"gasto","tipoRegistro":"proyectado","categoria":"cumpleanos","subcategoria":"Cumpleaños","detalle":"Regalos :)","monto":50.0,"fecha":"2026-03-25","persona":"Sanat","grupoId":null},{"id":"seed_0166","tipo":"gasto","tipoRegistro":"real","categoria":"fijos_vivienda","subcategoria":"Servicios","detalle":"Luz","monto":101.0,"fecha":"2026-04-08","persona":"Sanat","grupoId":null},{"id":"seed_0167","tipo":"gasto","tipoRegistro":"proyectado","categoria":"servicios_digitales","subcategoria":"Plan Móvil","detalle":"Entel","monto":40.0,"fecha":"2026-04-06","persona":"Sanat","grupoId":null},{"id":"seed_0168","tipo":"gasto","tipoRegistro":"real","categoria":"otros","subcategoria":"Salida Familiar","detalle":"","monto":100.0,"fecha":"2026-03-26","persona":"Sanat","grupoId":null},{"id":"seed_0169","tipo":"gasto","tipoRegistro":"proyectado","categoria":"inversion","subcategoria":"ChatGPT","detalle":"","monto":23.0,"fecha":"2026-03-30","persona":"Sanat","grupoId":null},{"id":"seed_0170","tipo":"gasto","tipoRegistro":"real","categoria":"aseo_personal","subcategoria":"Aseo Personal","detalle":"Desodorante, etc","monto":46.5,"fecha":"2026-04-04","persona":"Sanat","grupoId":null},{"id":"seed_0171","tipo":"gasto","tipoRegistro":"proyectado","categoria":"fijos_vivienda","subcategoria":"Alquiler","detalle":"Minidepa","monto":550.0,"fecha":"2026-03-27","persona":"Sanat","grupoId":null},{"id":"seed_0172","tipo":"gasto","tipoRegistro":"real","categoria":"fijos_vivienda","subcategoria":"Alquiler","detalle":"Minidepa","monto":550.0,"fecha":"2026-03-28","persona":"Sanat","grupoId":null},{"id":"seed_0173","tipo":"gasto","tipoRegistro":"real","categoria":"mascota","subcategoria":"Gata","detalle":"Flora","monto":40.0,"fecha":"2026-04-04","persona":"Sanat","grupoId":null},{"id":"seed_0174","tipo":"gasto","tipoRegistro":"proyectado","categoria":"servicios_digitales","subcategoria":"Spotify","detalle":"Música","monto":21.0,"fecha":"2026-03-20","persona":"Sanat","grupoId":null},{"id":"seed_0175","tipo":"gasto","tipoRegistro":"real","categoria":"otros","subcategoria":"Salida Familiar","detalle":"","monto":84.29,"fecha":"2026-04-04","persona":"Sanat","grupoId":null},{"id":"seed_0176","tipo":"gasto","tipoRegistro":"real","categoria":"inversion","subcategoria":"ChatGPT","detalle":"","monto":23.0,"fecha":"2026-04-04","persona":"Sanat","grupoId":null},{"id":"seed_0177","tipo":"gasto","tipoRegistro":"proyectado","categoria":"servicios_digitales","subcategoria":"Google One","detalle":"Almacenamiento","monto":13.0,"fecha":"2026-04-21","persona":"Sanat","grupoId":null},{"id":"seed_0178","tipo":"gasto","tipoRegistro":"real","categoria":"transporte","subcategoria":"Varios","detalle":"Bus/Tren/Taxi","monto":133.0,"fecha":"2026-04-04","persona":"Sanat","grupoId":null},{"id":"seed_0179","tipo":"gasto","tipoRegistro":"real","categoria":"transporte","subcategoria":"Varios","detalle":"Bus/Tren/Taxi","monto":26.5,"fecha":"2026-04-05","persona":"Sanat","grupoId":null},{"id":"seed_0180","tipo":"gasto","tipoRegistro":"real","categoria":"otros","subcategoria":"Varios","detalle":"","monto":126.0,"fecha":"2026-04-05","persona":"Sanat","grupoId":null},{"id":"seed_0181","tipo":"gasto","tipoRegistro":"proyectado","categoria":"fijos_vivienda","subcategoria":"Aseo de Casa","detalle":"","monto":50.0,"fecha":"2026-03-25","persona":"Sanat","grupoId":null},{"id":"seed_0182","tipo":"gasto","tipoRegistro":"real","categoria":"fijos_vivienda","subcategoria":"Aseo de Casa","detalle":"","monto":19.9,"fecha":"2026-04-04","persona":"Sanat","grupoId":null},{"id":"seed_0183","tipo":"gasto","tipoRegistro":"real","categoria":"fijos_vivienda","subcategoria":"Servicios","detalle":"Internet","monto":60.0,"fecha":"2026-04-08","persona":"Sanat","grupoId":null},{"id":"seed_0184","tipo":"gasto","tipoRegistro":"real","categoria":"servicios_digitales","subcategoria":"Plan Móvil","detalle":"Entel","monto":40.0,"fecha":"2026-04-12","persona":"Sanat","grupoId":null},{"id":"seed_0185","tipo":"gasto","tipoRegistro":"real","categoria":"transporte","subcategoria":"Varios","detalle":"Bus/Tren/Taxi","monto":66.5,"fecha":"2026-04-12","persona":"Sanat","grupoId":null},{"id":"seed_0186","tipo":"gasto","tipoRegistro":"proyectado","categoria":"inversion","subcategoria":"Claude","detalle":"","monto":74.8,"fecha":"2026-04-21","persona":"Sanat","grupoId":null},{"id":"seed_0187","tipo":"gasto","tipoRegistro":"real","categoria":"inversion","subcategoria":"Claude","detalle":"","monto":74.8,"fecha":"2026-04-21","persona":"Sanat","grupoId":null}];

// ============ HELPERS ============
const formatMonto = (v, moneda = 'S/.') => {
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
const getRangoMesFinanciero = (fechaRef, diaInicio, ajustar) => {
  const ref = new Date(fechaRef);
  ref.setHours(0, 0, 0, 0);

  // candidato: día de inicio del mes actual
  let inicio = new Date(ref.getFullYear(), ref.getMonth(), diaInicio);
  if (ajustar) inicio = ajustarSiFinDeSemana(inicio);

  if (ref < inicio) {
    inicio = new Date(ref.getFullYear(), ref.getMonth() - 1, diaInicio);
    if (ajustar) inicio = ajustarSiFinDeSemana(inicio);
  }

  let fin = new Date(inicio.getFullYear(), inicio.getMonth() + 1, diaInicio);
  if (ajustar) fin = ajustarSiFinDeSemana(fin);
  fin.setDate(fin.getDate() - 1);
  fin.setHours(23, 59, 59, 999);

  return { inicio, fin };
};

const formatFecha = (d) => {
  const dd = String(d.getDate()).padStart(2, '0');
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const yyyy = d.getFullYear();
  return `${dd}/${mm}/${yyyy}`;
};

const formatFechaCorta = (d) => {
  const dd = String(d.getDate()).padStart(2, '0');
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  return `${dd}/${mm}`;
};

const toISODate = (d) => {
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
};

const NOMBRES_MES = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
const NOMBRES_MES_LARGO = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

// ============ STORAGE ============
const STORAGE_KEYS = {
  TRANSACCIONES: 'finanzas:transacciones',
  CONFIG: 'finanzas:config',
  CATEGORIAS_GASTO: 'finanzas:cat_gasto',
  CATEGORIAS_INGRESO: 'finanzas:cat_ingreso',
  SEEDED: 'finanzas:seeded',
};

const loadData = async (key, fallback) => {
  try {
    const v = localStorage.getItem(key);
    if (v) return JSON.parse(v);
    return fallback;
  } catch {
    return fallback;
  }
};

const saveData = async (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (e) {
    console.error('Error guardando', key, e);
    return false;
  }
};

// ============ COMPONENTE PRINCIPAL ============
export default function App() {
  const [vista, setVista] = useState('dashboard'); // dashboard | registro | analisis | config
  const [transacciones, setTransacciones] = useState([]);
  const [config, setConfig] = useState(DEFAULT_CONFIG);
  const [catGasto, setCatGasto] = useState(DEFAULT_CATEGORIAS_GASTO);
  const [catIngreso, setCatIngreso] = useState(DEFAULT_CATEGORIAS_INGRESO);
  const [loading, setLoading] = useState(true);
  const [fechaRef, setFechaRef] = useState(new Date());
  const [showForm, setShowForm] = useState(false);
  const [editTx, setEditTx] = useState(null);
  const [toast, setToast] = useState(null);

  // Cargar datos iniciales (con siembra automática la primera vez)
  useEffect(() => {
    (async () => {
      const [txs, cfg, cg, ci, seeded] = await Promise.all([
        loadData(STORAGE_KEYS.TRANSACCIONES, []),
        loadData(STORAGE_KEYS.CONFIG, DEFAULT_CONFIG),
        loadData(STORAGE_KEYS.CATEGORIAS_GASTO, DEFAULT_CATEGORIAS_GASTO),
        loadData(STORAGE_KEYS.CATEGORIAS_INGRESO, DEFAULT_CATEGORIAS_INGRESO),
        loadData(STORAGE_KEYS.SEEDED, false),
      ]);

      let finalTxs = txs;
      // Si nunca se ha sembrado y no hay transacciones, cargar datos de Sanat
      if (!seeded && txs.length === 0) {
        finalTxs = SEED_DATA;
        await saveData(STORAGE_KEYS.TRANSACCIONES, finalTxs);
        await saveData(STORAGE_KEYS.SEEDED, true);
      }

      setTransacciones(finalTxs);
      setConfig(cfg);
      setCatGasto(cg);
      setCatIngreso(ci);
      setLoading(false);
    })();
  }, []);

  const showToast = (msg, tipo = 'success') => {
    setToast({ msg, tipo });
    setTimeout(() => setToast(null), 2500);
  };

  // ============ ACCIONES ============
  const guardarTx = async (tx) => {
    let nuevas;
    if (tx.id) {
      nuevas = transacciones.map(t => t.id === tx.id ? tx : t);
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
        nuevasTx.push({
          ...tx,
          id: i === 0 ? baseId : `${baseId}_${i}`,
          fecha: toISODate(fecha),
          grupoId,
          monto: parseFloat(tx.monto) || 0,
        });
      }
      nuevas = [...transacciones, ...nuevasTx];
    }
    setTransacciones(nuevas);
    await saveData(STORAGE_KEYS.TRANSACCIONES, nuevas);
    showToast(tx.id ? 'Actualizado ✓' : 'Registrado ✓');
    setShowForm(false);
    setEditTx(null);
  };

  const eliminarTx = async (id, soloEste = true) => {
    const tx = transacciones.find(t => t.id === id);
    let nuevas;
    if (!soloEste && tx?.grupoId) {
      // eliminar todo el grupo desde esta fecha en adelante
      nuevas = transacciones.filter(t => {
        if (t.grupoId !== tx.grupoId) return true;
        return new Date(t.fecha) < new Date(tx.fecha);
      });
    } else {
      nuevas = transacciones.filter(t => t.id !== id);
    }
    setTransacciones(nuevas);
    await saveData(STORAGE_KEYS.TRANSACCIONES, nuevas);
    showToast('Eliminado');
  };

  const marcarComoReal = async (id) => {
    const tx = transacciones.find(t => t.id === id);
    if (!tx) return;
    const nuevas = transacciones.map(t =>
      t.id === id ? { ...t, tipoRegistro: 'real' } : t
    );
    setTransacciones(nuevas);
    await saveData(STORAGE_KEYS.TRANSACCIONES, nuevas);
    showToast('Marcado como real ✓');
  };

  const exportarCSV = () => {
    const header = ['fecha', 'tipo', 'tipoRegistro', 'categoria', 'subcategoria', 'detalle', 'monto', 'persona'];
    const rows = transacciones.map(t => [
      t.fecha, t.tipo, t.tipoRegistro, t.categoria, t.subcategoria || '',
      t.detalle || '', t.monto, t.persona || ''
    ]);
    const csv = [header.join(','), ...rows.map(r =>
      r.map(c => `"${String(c).replace(/"/g, '""')}"`).join(',')
    )].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `finanzas_${toISODate(new Date())}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('CSV descargado ✓');
  };

  // ============ DATOS DEL MES ACTUAL ============
  const mesActual = useMemo(() => {
    return getRangoMesFinanciero(fechaRef, config.diaInicioMes, config.ajustarFinDeSemana);
  }, [fechaRef, config]);

  const txDelMes = useMemo(() => {
    return transacciones.filter(t => {
      const f = new Date(t.fecha + 'T12:00:00');
      return f >= mesActual.inicio && f <= mesActual.fin;
    });
  }, [transacciones, mesActual]);

  const stats = useMemo(() => {
    const ingresoProy = txDelMes.filter(t => t.tipo === 'ingreso' && t.tipoRegistro === 'proyectado').reduce((s, t) => s + Number(t.monto), 0);
    const ingresoReal = txDelMes.filter(t => t.tipo === 'ingreso' && t.tipoRegistro === 'real').reduce((s, t) => s + Number(t.monto), 0);
    const gastoProy = txDelMes.filter(t => t.tipo === 'gasto' && t.tipoRegistro === 'proyectado').reduce((s, t) => s + Number(t.monto), 0);
    const gastoReal = txDelMes.filter(t => t.tipo === 'gasto' && t.tipoRegistro === 'real').reduce((s, t) => s + Number(t.monto), 0);
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

  if (loading) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <div className="text-stone-600 font-serif text-xl italic">Cargando...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50 pb-24" style={{ fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600;9..144,700;9..144,800;9..144,900&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap');
        .font-serif { font-family: 'Fraunces', Georgia, serif; font-feature-settings: 'ss01' on; }
        .font-sans { font-family: 'Plus Jakarta Sans', system-ui, sans-serif; }
        .glass { backdrop-filter: blur(12px); background: rgba(255,255,255,0.75); }
        .grain { background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.04 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E"); }
        @keyframes slide-up { from { transform: translateY(100%); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        @keyframes fade-in { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        .animate-slide-up { animation: slide-up 0.3s cubic-bezier(0.16, 1, 0.3, 1); }
        .animate-fade-in { animation: fade-in 0.4s ease-out; }
        .stagger > * { animation: fade-in 0.5s ease-out backwards; }
        .stagger > *:nth-child(1) { animation-delay: 0.05s; }
        .stagger > *:nth-child(2) { animation-delay: 0.1s; }
        .stagger > *:nth-child(3) { animation-delay: 0.15s; }
        .stagger > *:nth-child(4) { animation-delay: 0.2s; }
        .stagger > *:nth-child(5) { animation-delay: 0.25s; }
      `}</style>

      {/* ========= HEADER ========= */}
      <header className="sticky top-0 z-30 glass border-b border-stone-200">
        <div className="max-w-2xl mx-auto px-5 py-4 flex items-center justify-between">
          <div>
            <h1 className="font-serif text-2xl font-semibold text-stone-900 leading-none tracking-tight">
              Finanzas<span className="text-amber-700 italic">.</span>
            </h1>
            <p className="text-[11px] text-stone-500 uppercase tracking-widest mt-1">
              {config.persona}
            </p>
          </div>
          <button
            onClick={() => setVista('config')}
            className="p-2 hover:bg-stone-100 rounded-full transition"
          >
            <Settings className="w-5 h-5 text-stone-600" />
          </button>
        </div>
      </header>

      {/* ========= NAVEGADOR DE MES ========= */}
      <div className="max-w-2xl mx-auto px-5 pt-4">
        <div className="flex items-center justify-between bg-white rounded-2xl border border-stone-200 p-3 shadow-sm">
          <button onClick={() => navegarMes(-1)} className="p-2 hover:bg-stone-100 rounded-full transition">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div className="text-center">
            <div className="font-serif text-lg font-semibold text-stone-900">
              {formatFechaCorta(mesActual.inicio)} – {formatFechaCorta(mesActual.fin)}
            </div>
            <div className="text-[10px] uppercase tracking-widest text-stone-500 mt-0.5">
              {NOMBRES_MES_LARGO[mesActual.inicio.getMonth()]} {mesActual.inicio.getFullYear()}
            </div>
          </div>
          <button onClick={() => navegarMes(1)} className="p-2 hover:bg-stone-100 rounded-full transition">
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* ========= VISTAS ========= */}
      <main className="max-w-2xl mx-auto px-5 pt-5">
        {vista === 'dashboard' && (
          <Dashboard stats={stats} txDelMes={txDelMes} catGasto={catGasto} catIngreso={catIngreso} config={config} onMarcarReal={marcarComoReal} onEditar={(tx) => { setEditTx(tx); setShowForm(true); }} onEliminar={eliminarTx} />
        )}
        {vista === 'registro' && (
          <Registro transacciones={txDelMes} catGasto={catGasto} catIngreso={catIngreso} config={config} onMarcarReal={marcarComoReal} onEditar={(tx) => { setEditTx(tx); setShowForm(true); }} onEliminar={eliminarTx} />
        )}
        {vista === 'analisis' && (
          <Analisis txDelMes={txDelMes} catGasto={catGasto} catIngreso={catIngreso} config={config} stats={stats} />
        )}
        {vista === 'config' && (
          <Config config={config} setConfig={async (c) => { setConfig(c); await saveData(STORAGE_KEYS.CONFIG, c); showToast('Guardado ✓'); }}
            catGasto={catGasto} setCatGasto={async (c) => { setCatGasto(c); await saveData(STORAGE_KEYS.CATEGORIAS_GASTO, c); }}
            catIngreso={catIngreso} setCatIngreso={async (c) => { setCatIngreso(c); await saveData(STORAGE_KEYS.CATEGORIAS_INGRESO, c); }}
            onExport={exportarCSV}
            totalTx={transacciones.length}
          />
        )}
      </main>

      {/* ========= FAB ========= */}
      {vista !== 'config' && (
        <button
          onClick={() => { setEditTx(null); setShowForm(true); }}
          className="fixed bottom-24 right-5 z-20 w-14 h-14 bg-stone-900 hover:bg-stone-800 text-white rounded-full shadow-2xl flex items-center justify-center transition transform active:scale-95"
          style={{ boxShadow: '0 10px 30px -5px rgba(0,0,0,0.4)' }}
        >
          <Plus className="w-6 h-6" />
        </button>
      )}

      {/* ========= BOTTOM NAV ========= */}
      <nav className="fixed bottom-0 left-0 right-0 z-30 glass border-t border-stone-200">
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
              className={`flex flex-col items-center gap-1 py-2 rounded-xl transition ${vista === item.id ? 'text-amber-800' : 'text-stone-500'}`}
            >
              <item.icon className="w-5 h-5" strokeWidth={vista === item.id ? 2.5 : 1.75} />
              <span className={`text-[10px] uppercase tracking-wider ${vista === item.id ? 'font-semibold' : ''}`}>{item.label}</span>
            </button>
          ))}
        </div>
      </nav>

      {/* ========= FORM MODAL ========= */}
      {showForm && (
        <FormularioTx
          tx={editTx}
          catGasto={catGasto}
          catIngreso={catIngreso}
          config={config}
          onGuardar={guardarTx}
          onCerrar={() => { setShowForm(false); setEditTx(null); }}
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
  );
}

// ============ DASHBOARD ============
function Dashboard({ stats, txDelMes, catGasto, catIngreso, config, onMarcarReal, onEditar, onEliminar }) {
  const ultimas = useMemo(() => {
    return [...txDelMes].sort((a, b) => new Date(b.fecha) - new Date(a.fecha)).slice(0, 5);
  }, [txDelMes]);

  const findCat = (tipo, id) => (tipo === 'gasto' ? catGasto : catIngreso).find(c => c.id === id) || { emoji: '📦', nombre: id, color: '#888' };

  const balanceColor = stats.balanceReal >= 0 ? 'text-emerald-700' : 'text-red-600';
  const ejecucionColor = stats.ejecucion <= 100 ? 'text-emerald-700' : 'text-red-600';

  return (
    <div className="space-y-5 stagger animate-fade-in">
      {/* HERO BALANCE */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-stone-900 via-stone-800 to-stone-900 text-white p-6 shadow-xl">
        <div className="absolute inset-0 grain opacity-30" />
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-amber-500/20 rounded-full blur-3xl" />
        <div className="relative">
          <p className="text-[10px] uppercase tracking-[0.2em] text-stone-400">Balance del período</p>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="font-serif text-5xl font-semibold tracking-tight">
              {formatMonto(stats.balanceReal, config.moneda)}
            </span>
          </div>
          <div className="mt-4 flex items-center gap-4 text-sm">
            <div>
              <span className="text-stone-400 text-xs">Proyectado</span>
              <div className="font-medium">{formatMonto(stats.balanceProy, config.moneda)}</div>
            </div>
            <div className="h-8 w-px bg-stone-700" />
            <div>
              <span className="text-stone-400 text-xs">Diferencia</span>
              <div className={`font-medium ${stats.balanceReal - stats.balanceProy >= 0 ? 'text-emerald-400' : 'text-amber-400'}`}>
                {stats.balanceReal - stats.balanceProy >= 0 ? '+' : ''}{formatMonto(stats.balanceReal - stats.balanceProy, config.moneda)}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CARDS INGRESO/GASTO */}
      <div className="grid grid-cols-2 gap-3">
        <CardMetric
          icon={<TrendingUp className="w-4 h-4" />}
          label="Ingresos"
          real={stats.ingresoReal}
          proy={stats.ingresoProy}
          accent="emerald"
          moneda={config.moneda}
        />
        <CardMetric
          icon={<TrendingDown className="w-4 h-4" />}
          label="Gastos"
          real={stats.gastoReal}
          proy={stats.gastoProy}
          accent="red"
          moneda={config.moneda}
        />
      </div>

      {/* EJECUCIÓN PRESUPUESTO */}
      <div className="bg-white rounded-2xl border border-stone-200 p-5 shadow-sm">
        <div className="flex items-baseline justify-between mb-3">
          <div>
            <p className="text-[10px] uppercase tracking-widest text-stone-500">Ejecución de presupuesto</p>
            <p className="font-serif text-2xl font-semibold mt-1">
              {stats.ejecucion.toFixed(0)}<span className="text-stone-400 text-base">%</span>
            </p>
          </div>
          <div className={`px-2.5 py-1 rounded-full text-[11px] font-semibold uppercase tracking-wide ${stats.ejecucion <= 80 ? 'bg-emerald-50 text-emerald-700' : stats.ejecucion <= 100 ? 'bg-amber-50 text-amber-700' : 'bg-red-50 text-red-700'}`}>
            {stats.ejecucion <= 80 ? 'Saludable' : stats.ejecucion <= 100 ? 'Al límite' : 'Excedido'}
          </div>
        </div>
        <div className="h-2 bg-stone-100 rounded-full overflow-hidden">
          <div
            className={`h-full transition-all duration-700 ${stats.ejecucion <= 80 ? 'bg-emerald-500' : stats.ejecucion <= 100 ? 'bg-amber-500' : 'bg-red-500'}`}
            style={{ width: `${Math.min(stats.ejecucion, 100)}%` }}
          />
        </div>
        <p className="text-xs text-stone-500 mt-2">
          Has gastado {formatMonto(stats.gastoReal, config.moneda)} de {formatMonto(stats.gastoProy, config.moneda)} presupuestados
        </p>
      </div>

      {/* ÚLTIMOS MOVIMIENTOS */}
      <div>
        <div className="flex items-baseline justify-between mb-3 px-1">
          <h2 className="font-serif text-xl font-semibold">Movimientos recientes</h2>
          <span className="text-xs text-stone-500">{txDelMes.length} en total</span>
        </div>
        {ultimas.length === 0 ? (
          <div className="bg-white rounded-2xl border border-dashed border-stone-300 p-8 text-center">
            <p className="text-stone-500 text-sm">Aún no hay movimientos en este período</p>
            <p className="text-stone-400 text-xs mt-1">Toca el botón + para registrar</p>
          </div>
        ) : (
          <div className="space-y-2">
            {ultimas.map(tx => (
              <ItemTx key={tx.id} tx={tx} cat={findCat(tx.tipo, tx.categoria)} moneda={config.moneda} onMarcarReal={onMarcarReal} onEditar={onEditar} onEliminar={onEliminar} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function CardMetric({ icon, label, real, proy, accent, moneda }) {
  const ratio = proy > 0 ? (real / proy) * 100 : 0;
  const accentMap = {
    emerald: { text: 'text-emerald-700', bg: 'bg-emerald-50', icon: 'bg-emerald-100 text-emerald-700' },
    red: { text: 'text-red-700', bg: 'bg-red-50', icon: 'bg-red-100 text-red-700' },
  };
  const a = accentMap[accent];
  return (
    <div className="bg-white rounded-2xl border border-stone-200 p-4 shadow-sm">
      <div className="flex items-center gap-2 mb-3">
        <div className={`w-7 h-7 rounded-full ${a.icon} flex items-center justify-center`}>
          {icon}
        </div>
        <span className="text-[10px] uppercase tracking-widest text-stone-500 font-medium">{label}</span>
      </div>
      <div className="font-serif text-2xl font-semibold tracking-tight">
        {formatMonto(real, moneda)}
      </div>
      <div className="mt-2 text-[11px] text-stone-500">
        de {formatMonto(proy, moneda)} <span className="text-stone-400">proyectado</span>
      </div>
    </div>
  );
}

function ItemTx({ tx, cat, moneda, onMarcarReal, onEditar, onEliminar }) {
  const esGasto = tx.tipo === 'gasto';
  const esProy = tx.tipoRegistro === 'proyectado';
  const [open, setOpen] = useState(false);
  const fecha = new Date(tx.fecha + 'T12:00:00');

  return (
    <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-sm">
      <button
        onClick={() => setOpen(!open)}
        className="w-full p-3.5 flex items-center gap-3 hover:bg-stone-50 transition"
      >
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0"
          style={{ backgroundColor: cat.color + '22' }}
        >
          {cat.emoji}
        </div>
        <div className="flex-1 min-w-0 text-left">
          <div className="flex items-center gap-1.5">
            <p className="font-medium text-stone-900 text-sm truncate">{tx.detalle || cat.nombre}</p>
            {esProy && <span className="text-[9px] uppercase tracking-wide bg-stone-100 text-stone-600 px-1.5 py-0.5 rounded font-semibold">Proy</span>}
            {tx.grupoId && <Repeat className="w-3 h-3 text-stone-400" />}
          </div>
          <p className="text-[11px] text-stone-500 mt-0.5">
            {formatFechaCorta(fecha)} · {cat.nombre}
            {tx.subcategoria && ` · ${tx.subcategoria}`}
          </p>
        </div>
        <div className={`font-serif font-semibold text-base ${esGasto ? 'text-stone-900' : 'text-emerald-700'}`}>
          {esGasto ? '−' : '+'}{formatMonto(tx.monto, moneda).replace(moneda + ' ', '')}
        </div>
      </button>
      {open && (
        <div className="border-t border-stone-100 p-3 flex gap-2 bg-stone-50">
          {esProy && (
            <button
              onClick={() => onMarcarReal(tx.id)}
              className="flex-1 text-xs font-medium px-3 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition flex items-center justify-center gap-1.5"
            >
              <Check className="w-3.5 h-3.5" /> Marcar como real
            </button>
          )}
          <button
            onClick={() => { onEditar(tx); setOpen(false); }}
            className="flex-1 text-xs font-medium px-3 py-2 bg-white border border-stone-300 rounded-lg hover:bg-stone-100 transition"
          >
            Editar
          </button>
          <button
            onClick={() => {
              if (tx.grupoId) {
                if (confirm('¿Eliminar solo este o todos los futuros?\n\nOK = solo este\nCancelar = ver más opciones')) {
                  onEliminar(tx.id, true);
                } else {
                  if (confirm('¿Eliminar esta y todas las futuras del grupo recurrente?')) {
                    onEliminar(tx.id, false);
                  }
                }
              } else {
                if (confirm('¿Eliminar este registro?')) onEliminar(tx.id, true);
              }
            }}
            className="px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
}

// ============ REGISTRO ============
function Registro({ transacciones, catGasto, catIngreso, config, onMarcarReal, onEditar, onEliminar }) {
  const [filtro, setFiltro] = useState('todos'); // todos | proyectado | real | gasto | ingreso
  const findCat = (tipo, id) => (tipo === 'gasto' ? catGasto : catIngreso).find(c => c.id === id) || { emoji: '📦', nombre: id, color: '#888' };

  const filtradas = useMemo(() => {
    let f = [...transacciones];
    if (filtro === 'proyectado') f = f.filter(t => t.tipoRegistro === 'proyectado');
    else if (filtro === 'real') f = f.filter(t => t.tipoRegistro === 'real');
    else if (filtro === 'gasto') f = f.filter(t => t.tipo === 'gasto');
    else if (filtro === 'ingreso') f = f.filter(t => t.tipo === 'ingreso');
    return f.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
  }, [transacciones, filtro]);

  const filtros = [
    { id: 'todos', label: 'Todos' },
    { id: 'real', label: 'Reales' },
    { id: 'proyectado', label: 'Proyectados' },
    { id: 'gasto', label: 'Gastos' },
    { id: 'ingreso', label: 'Ingresos' },
  ];

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1">
        {filtros.map(f => (
          <button
            key={f.id}
            onClick={() => setFiltro(f.id)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition ${
              filtro === f.id
                ? 'bg-stone-900 text-white'
                : 'bg-white border border-stone-200 text-stone-600 hover:bg-stone-50'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {filtradas.length === 0 ? (
        <div className="bg-white rounded-2xl border border-dashed border-stone-300 p-10 text-center">
          <p className="text-stone-500 text-sm">No hay registros con este filtro</p>
        </div>
      ) : (
        <div className="space-y-2">
          {filtradas.map(tx => (
            <ItemTx key={tx.id} tx={tx} cat={findCat(tx.tipo, tx.categoria)} moneda={config.moneda} onMarcarReal={onMarcarReal} onEditar={onEditar} onEliminar={onEliminar} />
          ))}
        </div>
      )}
    </div>
  );
}

// ============ ANÁLISIS ============
function Analisis({ txDelMes, catGasto, catIngreso, config, stats }) {
  const analisisCat = useMemo(() => {
    const map = {};
    txDelMes.filter(t => t.tipo === 'gasto').forEach(t => {
      if (!map[t.categoria]) map[t.categoria] = { proy: 0, real: 0 };
      if (t.tipoRegistro === 'proyectado') map[t.categoria].proy += Number(t.monto);
      else map[t.categoria].real += Number(t.monto);
    });
    return Object.entries(map).map(([catId, vals]) => {
      const cat = catGasto.find(c => c.id === catId) || { emoji: '📦', nombre: catId, color: '#888' };
      return {
        ...cat,
        ...vals,
        diff: vals.proy - vals.real,
        ejecucion: vals.proy > 0 ? (vals.real / vals.proy) * 100 : (vals.real > 0 ? 999 : 0),
      };
    }).sort((a, b) => Math.max(b.proy, b.real) - Math.max(a.proy, a.real));
  }, [txDelMes, catGasto]);

  const analisisIng = useMemo(() => {
    const map = {};
    txDelMes.filter(t => t.tipo === 'ingreso').forEach(t => {
      if (!map[t.categoria]) map[t.categoria] = { proy: 0, real: 0 };
      if (t.tipoRegistro === 'proyectado') map[t.categoria].proy += Number(t.monto);
      else map[t.categoria].real += Number(t.monto);
    });
    return Object.entries(map).map(([catId, vals]) => {
      const cat = catIngreso.find(c => c.id === catId) || { emoji: '💵', nombre: catId, color: '#888' };
      return { ...cat, ...vals };
    }).sort((a, b) => Math.max(b.proy, b.real) - Math.max(a.proy, a.real));
  }, [txDelMes, catIngreso]);

  return (
    <div className="space-y-5 animate-fade-in">
      {/* RESUMEN COMPARATIVO */}
      <div className="bg-white rounded-2xl border border-stone-200 p-5 shadow-sm">
        <h2 className="font-serif text-lg font-semibold mb-4">Proyectado vs Real</h2>
        <div className="space-y-3">
          <BarraComparativa label="Ingresos" proy={stats.ingresoProy} real={stats.ingresoReal} moneda={config.moneda} positivo />
          <BarraComparativa label="Gastos" proy={stats.gastoProy} real={stats.gastoReal} moneda={config.moneda} />
          <div className="pt-3 border-t border-stone-100">
            <BarraComparativa label="Balance" proy={stats.balanceProy} real={stats.balanceReal} moneda={config.moneda} positivo />
          </div>
        </div>
      </div>

      {/* GASTOS POR CATEGORÍA */}
      <div>
        <h2 className="font-serif text-xl font-semibold mb-3 px-1">Gastos por categoría</h2>
        {analisisCat.length === 0 ? (
          <div className="bg-white rounded-2xl border border-dashed border-stone-300 p-6 text-center">
            <p className="text-stone-500 text-sm">Sin gastos en este período</p>
          </div>
        ) : (
          <div className="space-y-2">
            {analisisCat.map(c => (
              <CategoriaCard key={c.id} cat={c} moneda={config.moneda} />
            ))}
          </div>
        )}
      </div>

      {/* INGRESOS POR CATEGORÍA */}
      {analisisIng.length > 0 && (
        <div>
          <h2 className="font-serif text-xl font-semibold mb-3 px-1">Ingresos por categoría</h2>
          <div className="space-y-2">
            {analisisIng.map(c => (
              <div key={c.id} className="bg-white rounded-2xl border border-stone-200 p-4 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg" style={{ backgroundColor: c.color + '22' }}>
                    {c.emoji}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-sm">{c.nombre}</p>
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
  );
}

function BarraComparativa({ label, proy, real, moneda, positivo }) {
  const max = Math.max(Math.abs(proy), Math.abs(real), 1);
  const pctProy = (Math.abs(proy) / max) * 100;
  const pctReal = (Math.abs(real) / max) * 100;
  const diff = real - proy;

  return (
    <div>
      <div className="flex items-baseline justify-between mb-1.5">
        <span className="text-xs font-medium text-stone-700 uppercase tracking-wide">{label}</span>
        <span className={`text-[11px] font-medium ${
          positivo
            ? (diff >= 0 ? 'text-emerald-600' : 'text-red-600')
            : (diff <= 0 ? 'text-emerald-600' : 'text-red-600')
        }`}>
          {diff >= 0 ? '+' : ''}{formatMonto(diff, moneda)}
        </span>
      </div>
      <div className="space-y-1.5">
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-stone-400 w-10">Proy</span>
          <div className="flex-1 h-1.5 bg-stone-100 rounded-full overflow-hidden">
            <div className="h-full bg-stone-400 rounded-full transition-all" style={{ width: `${pctProy}%` }} />
          </div>
          <span className="text-[11px] text-stone-600 font-medium w-20 text-right">{formatMonto(proy, moneda)}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-stone-400 w-10">Real</span>
          <div className="flex-1 h-1.5 bg-stone-100 rounded-full overflow-hidden">
            <div className={`h-full rounded-full transition-all ${positivo ? 'bg-emerald-500' : 'bg-red-500'}`} style={{ width: `${pctReal}%` }} />
          </div>
          <span className="text-[11px] text-stone-900 font-semibold w-20 text-right">{formatMonto(real, moneda)}</span>
        </div>
      </div>
    </div>
  );
}

function CategoriaCard({ cat, moneda }) {
  const ejec = Math.min(cat.ejecucion, 150);
  const color = cat.ejecucion <= 80 ? 'bg-emerald-500' : cat.ejecucion <= 100 ? 'bg-amber-500' : 'bg-red-500';

  return (
    <div className="bg-white rounded-2xl border border-stone-200 p-4 shadow-sm">
      <div className="flex items-center gap-3 mb-3">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg" style={{ backgroundColor: cat.color + '22' }}>
          {cat.emoji}
        </div>
        <div className="flex-1">
          <p className="font-medium text-sm">{cat.nombre}</p>
          <p className="text-[11px] text-stone-500 mt-0.5">
            {formatMonto(cat.real, moneda)} <span className="text-stone-400">/ {formatMonto(cat.proy, moneda)}</span>
          </p>
        </div>
        <div className={`text-xs font-bold px-2 py-1 rounded ${cat.ejecucion <= 80 ? 'bg-emerald-50 text-emerald-700' : cat.ejecucion <= 100 ? 'bg-amber-50 text-amber-700' : 'bg-red-50 text-red-700'}`}>
          {cat.ejecucion >= 999 ? 'sin proy' : `${cat.ejecucion.toFixed(0)}%`}
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

// ============ FORMULARIO ============
function FormularioTx({ tx, catGasto, catIngreso, config, onGuardar, onCerrar }) {
  const [tipo, setTipo] = useState(tx?.tipo || 'gasto');
  const [tipoRegistro, setTipoRegistro] = useState(tx?.tipoRegistro || 'real');
  const [categoria, setCategoria] = useState(tx?.categoria || '');
  const [subcategoria, setSubcategoria] = useState(tx?.subcategoria || '');
  const [detalle, setDetalle] = useState(tx?.detalle || '');
  const [monto, setMonto] = useState(tx?.monto || '');
  const [fecha, setFecha] = useState(tx?.fecha || toISODate(new Date()));
  const [veces, setVeces] = useState(1);

  const cats = tipo === 'gasto' ? catGasto : catIngreso;
  const editando = !!tx?.id;

  const submit = () => {
    if (!categoria || !monto) {
      alert('Completa la categoría y el monto');
      return;
    }
    onGuardar({
      ...(tx?.id ? { id: tx.id, grupoId: tx.grupoId } : {}),
      tipo, tipoRegistro, categoria, subcategoria, detalle,
      monto: parseFloat(monto), fecha, persona: config.persona,
      veces: editando ? 1 : veces,
    });
  };

  return (
    <div className="fixed inset-0 z-40 bg-black/40 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-stone-50 w-full sm:max-w-md rounded-t-3xl sm:rounded-3xl max-h-[92vh] overflow-y-auto animate-slide-up shadow-2xl">
        {/* HEADER */}
        <div className="sticky top-0 bg-stone-50 z-10 px-5 pt-4 pb-3 border-b border-stone-200">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-serif text-xl font-semibold">{editando ? 'Editar' : 'Nuevo registro'}</h2>
            <button onClick={onCerrar} className="p-1.5 hover:bg-stone-200 rounded-full">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Toggle Tipo */}
          <div className="grid grid-cols-2 gap-1 bg-stone-200 p-1 rounded-xl">
            <button
              onClick={() => { setTipo('gasto'); setCategoria(''); }}
              className={`py-2 rounded-lg text-sm font-medium transition ${tipo === 'gasto' ? 'bg-white shadow-sm text-stone-900' : 'text-stone-600'}`}
            >
              💸 Gasto
            </button>
            <button
              onClick={() => { setTipo('ingreso'); setCategoria(''); }}
              className={`py-2 rounded-lg text-sm font-medium transition ${tipo === 'ingreso' ? 'bg-white shadow-sm text-stone-900' : 'text-stone-600'}`}
            >
              💰 Ingreso
            </button>
          </div>
        </div>

        <div className="p-5 space-y-4">
          {/* MONTO GIGANTE */}
          <div className="text-center py-2">
            <label className="text-[10px] uppercase tracking-widest text-stone-500">Monto</label>
            <div className="flex items-center justify-center gap-1 mt-1">
              <span className="font-serif text-2xl text-stone-400">{config.moneda}</span>
              <input
                type="number"
                inputMode="decimal"
                value={monto}
                onChange={e => setMonto(e.target.value)}
                placeholder="0.00"
                step="0.01"
                className="font-serif text-5xl font-semibold bg-transparent text-center w-48 outline-none focus:outline-none"
              />
            </div>
          </div>

          {/* Tipo Registro */}
          <div>
            <label className="text-[10px] uppercase tracking-widest text-stone-500 mb-1.5 block">Tipo de registro</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setTipoRegistro('real')}
                className={`p-3 rounded-xl border-2 transition text-left ${tipoRegistro === 'real' ? 'border-stone-900 bg-stone-900 text-white' : 'border-stone-200 bg-white'}`}
              >
                <div className="flex items-center gap-1.5">
                  <Zap className="w-4 h-4" />
                  <span className="font-semibold text-sm">Real</span>
                </div>
                <p className={`text-[10px] mt-0.5 ${tipoRegistro === 'real' ? 'text-stone-300' : 'text-stone-500'}`}>Ya ocurrió</p>
              </button>
              <button
                onClick={() => setTipoRegistro('proyectado')}
                className={`p-3 rounded-xl border-2 transition text-left ${tipoRegistro === 'proyectado' ? 'border-stone-900 bg-stone-900 text-white' : 'border-stone-200 bg-white'}`}
              >
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4" />
                  <span className="font-semibold text-sm">Proyectado</span>
                </div>
                <p className={`text-[10px] mt-0.5 ${tipoRegistro === 'proyectado' ? 'text-stone-300' : 'text-stone-500'}`}>Presupuesto</p>
              </button>
            </div>
          </div>

          {/* Categoría */}
          <div>
            <label className="text-[10px] uppercase tracking-widest text-stone-500 mb-1.5 block">Categoría</label>
            <div className="grid grid-cols-4 gap-2">
              {cats.map(c => (
                <button
                  key={c.id}
                  onClick={() => setCategoria(c.id)}
                  className={`p-2 rounded-xl border-2 transition flex flex-col items-center gap-0.5 ${categoria === c.id ? 'border-stone-900 bg-white' : 'border-stone-200 bg-white hover:border-stone-300'}`}
                  style={categoria === c.id ? { borderColor: c.color } : {}}
                >
                  <span className="text-xl">{c.emoji}</span>
                  <span className="text-[9px] text-stone-700 font-medium leading-tight text-center">{c.nombre}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Detalle */}
          <div>
            <label className="text-[10px] uppercase tracking-widest text-stone-500 mb-1.5 block">Detalle (opcional)</label>
            <input
              type="text"
              value={detalle}
              onChange={e => setDetalle(e.target.value)}
              placeholder="Ej: Pago de luz, almuerzo del jueves..."
              className="w-full px-3.5 py-2.5 bg-white border border-stone-200 rounded-xl text-sm focus:border-stone-900 outline-none"
            />
          </div>

          {/* Subcategoría */}
          <div>
            <label className="text-[10px] uppercase tracking-widest text-stone-500 mb-1.5 block">Subcategoría (opcional)</label>
            <input
              type="text"
              value={subcategoria}
              onChange={e => setSubcategoria(e.target.value)}
              placeholder="Ej: Servicios, Comida casa..."
              className="w-full px-3.5 py-2.5 bg-white border border-stone-200 rounded-xl text-sm focus:border-stone-900 outline-none"
            />
          </div>

          {/* Fecha */}
          <div>
            <label className="text-[10px] uppercase tracking-widest text-stone-500 mb-1.5 block">Fecha</label>
            <input
              type="date"
              value={fecha}
              onChange={e => setFecha(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-white border border-stone-200 rounded-xl text-sm focus:border-stone-900 outline-none"
            />
          </div>

          {/* Recurrencia */}
          {!editando && (
            <div>
              <label className="text-[10px] uppercase tracking-widest text-stone-500 mb-1.5 block flex items-center gap-1.5">
                <Repeat className="w-3 h-3" /> Repetir mensualmente
              </label>
              <div className="flex items-center gap-2 bg-white border border-stone-200 rounded-xl p-2">
                <button
                  onClick={() => setVeces(Math.max(1, veces - 1))}
                  className="w-9 h-9 rounded-lg bg-stone-100 hover:bg-stone-200 flex items-center justify-center text-lg font-medium"
                >−</button>
                <div className="flex-1 text-center">
                  <span className="font-serif text-lg font-semibold">{veces}</span>
                  <span className="text-stone-500 text-xs ml-1">{veces === 1 ? 'vez (sin repetir)' : 'veces'}</span>
                </div>
                <button
                  onClick={() => setVeces(Math.min(12, veces + 1))}
                  className="w-9 h-9 rounded-lg bg-stone-100 hover:bg-stone-200 flex items-center justify-center text-lg font-medium"
                >+</button>
              </div>
              {veces > 1 && (
                <p className="text-[11px] text-stone-500 mt-1.5 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  Se crearán {veces} registros, uno por mes
                </p>
              )}
              <div className="flex gap-1.5 mt-2">
                {[1, 3, 6, 12].map(v => (
                  <button key={v} onClick={() => setVeces(v)} className={`text-xs px-2.5 py-1 rounded-full border ${veces === v ? 'bg-stone-900 text-white border-stone-900' : 'bg-white border-stone-200 text-stone-600'}`}>
                    {v === 1 ? 'Solo 1' : `${v} meses`}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* GUARDAR */}
          <button
            onClick={submit}
            className="w-full py-3.5 bg-stone-900 hover:bg-stone-800 text-white font-semibold rounded-xl transition shadow-lg active:scale-[0.98]"
          >
            {editando ? 'Actualizar' : 'Guardar registro'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ============ CONFIG ============
function Config({ config, setConfig, catGasto, setCatGasto, catIngreso, setCatIngreso, onExport, totalTx }) {
  const [showCats, setShowCats] = useState(null); // 'gasto' | 'ingreso' | null
  const [nuevaCat, setNuevaCat] = useState({ nombre: '', emoji: '📦', color: '#8D99AE' });
  const [importing, setImporting] = useState(false);

  const agregarCat = () => {
    if (!nuevaCat.nombre.trim()) return;
    const nueva = { ...nuevaCat, id: nuevaCat.nombre.toLowerCase().replace(/\s+/g, '_') };
    if (showCats === 'gasto') setCatGasto([...catGasto, nueva]);
    else setCatIngreso([...catIngreso, nueva]);
    setNuevaCat({ nombre: '', emoji: '📦', color: '#8D99AE' });
  };

  const eliminarCat = (id) => {
    if (!confirm('¿Eliminar esta categoría?')) return;
    if (showCats === 'gasto') setCatGasto(catGasto.filter(c => c.id !== id));
    else setCatIngreso(catIngreso.filter(c => c.id !== id));
  };

  return (
    <div className="space-y-4 animate-fade-in">
      {/* Persona */}
      <Section titulo="Tu nombre">
        <input
          type="text"
          value={config.persona}
          onChange={e => setConfig({ ...config, persona: e.target.value })}
          className="w-full px-3.5 py-2.5 bg-white border border-stone-200 rounded-xl text-sm focus:border-stone-900 outline-none"
        />
      </Section>

      {/* Inicio de mes */}
      <Section titulo="Día de inicio del período">
        <p className="text-xs text-stone-500 mb-2">El día que recibes tu pago. El período va de este día al día anterior del siguiente mes.</p>
        <div className="flex items-center gap-2">
          <input
            type="number"
            min="1"
            max="28"
            value={config.diaInicioMes}
            onChange={e => setConfig({ ...config, diaInicioMes: parseInt(e.target.value) || 1 })}
            className="w-20 px-3 py-2 bg-white border border-stone-200 rounded-xl text-sm text-center font-serif text-lg focus:border-stone-900 outline-none"
          />
          <span className="text-sm text-stone-600">de cada mes</span>
        </div>
        <label className="flex items-center gap-2 mt-3 cursor-pointer">
          <input
            type="checkbox"
            checked={config.ajustarFinDeSemana}
            onChange={e => setConfig({ ...config, ajustarFinDeSemana: e.target.checked })}
            className="w-4 h-4"
          />
          <span className="text-sm text-stone-700">Si cae fin de semana, ajustar al viernes</span>
        </label>
      </Section>

      {/* Moneda */}
      <Section titulo="Moneda">
        <div className="grid grid-cols-4 gap-2">
          {['S/.', '$', '€', '£'].map(m => (
            <button
              key={m}
              onClick={() => setConfig({ ...config, moneda: m })}
              className={`py-2 rounded-xl border-2 font-serif text-lg ${config.moneda === m ? 'border-stone-900 bg-stone-900 text-white' : 'border-stone-200 bg-white'}`}
            >
              {m}
            </button>
          ))}
        </div>
      </Section>

      {/* Categorías */}
      <Section titulo="Categorías">
        <div className="grid grid-cols-2 gap-2">
          <button onClick={() => setShowCats('gasto')} className="p-3 bg-white border border-stone-200 rounded-xl text-sm font-medium text-left hover:bg-stone-50">
            💸 Gastos <span className="text-stone-500">({catGasto.length})</span>
          </button>
          <button onClick={() => setShowCats('ingreso')} className="p-3 bg-white border border-stone-200 rounded-xl text-sm font-medium text-left hover:bg-stone-50">
            💰 Ingresos <span className="text-stone-500">({catIngreso.length})</span>
          </button>
        </div>
      </Section>

      {/* Datos */}
      <Section titulo="Datos">
        <p className="text-xs text-stone-500 mb-3">{totalTx} registros guardados</p>
        <div className="grid grid-cols-2 gap-2">
          <button onClick={onExport} className="flex items-center justify-center gap-2 py-2.5 bg-white border border-stone-200 rounded-xl text-sm font-medium hover:bg-stone-50">
            <Download className="w-4 h-4" /> Exportar CSV
          </button>
          <button
            onClick={() => {
              if (confirm('🔄 Esto reemplazará TODOS los registros con los datos originales del Sheet (Sanat). ¿Continuar?')) {
                {
                  localStorage.setItem(STORAGE_KEYS.TRANSACCIONES, JSON.stringify(SEED_DATA));
                  localStorage.setItem(STORAGE_KEYS.SEEDED, JSON.stringify(true));
                  location.reload();
                }
              }
            }}
            className="flex items-center justify-center gap-2 py-2.5 bg-amber-50 text-amber-700 border border-amber-200 rounded-xl text-sm font-medium hover:bg-amber-100"
          >
            <Upload className="w-4 h-4" /> Recargar Sheet
          </button>
        </div>
        <button
          onClick={() => {
            if (confirm('⚠️ Esto borrará TODOS los registros (incluso los del Sheet). ¿Continuar?')) {
              localStorage.setItem(STORAGE_KEYS.TRANSACCIONES, JSON.stringify([]));
              localStorage.setItem(STORAGE_KEYS.SEEDED, JSON.stringify(true));
              location.reload();
            }
          }}
          className="w-full mt-2 flex items-center justify-center gap-2 py-2.5 bg-red-50 text-red-600 border border-red-200 rounded-xl text-sm font-medium hover:bg-red-100"
        >
          <Trash2 className="w-4 h-4" /> Borrar todo
        </button>
      </Section>

      <p className="text-center text-[11px] text-stone-400 pt-4">
        Los datos se guardan localmente en este dispositivo.<br />
        Exporta el CSV regularmente para sincronizar con tu Sheet.
      </p>

      {/* MODAL CATEGORÍAS */}
      {showCats && (
        <div className="fixed inset-0 z-40 bg-black/40 flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-stone-50 w-full sm:max-w-md rounded-t-3xl sm:rounded-3xl max-h-[88vh] overflow-y-auto animate-slide-up shadow-2xl">
            <div className="sticky top-0 bg-stone-50 z-10 px-5 pt-4 pb-3 border-b border-stone-200 flex items-center justify-between">
              <h2 className="font-serif text-xl font-semibold">Categorías de {showCats === 'gasto' ? 'Gasto' : 'Ingreso'}</h2>
              <button onClick={() => setShowCats(null)} className="p-1.5 hover:bg-stone-200 rounded-full">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-5 space-y-4">
              {/* Lista */}
              <div className="space-y-2">
                {(showCats === 'gasto' ? catGasto : catIngreso).map(c => (
                  <div key={c.id} className="bg-white rounded-xl border border-stone-200 p-3 flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg flex items-center justify-center text-lg" style={{ backgroundColor: c.color + '22' }}>
                      {c.emoji}
                    </div>
                    <span className="flex-1 text-sm font-medium">{c.nombre}</span>
                    <button onClick={() => eliminarCat(c.id)} className="text-red-500 p-1.5 hover:bg-red-50 rounded">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>

              {/* Agregar */}
              <div className="bg-white rounded-xl border border-dashed border-stone-300 p-4">
                <p className="text-xs uppercase tracking-widest text-stone-500 mb-2">Nueva categoría</p>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={nuevaCat.emoji}
                    onChange={e => setNuevaCat({ ...nuevaCat, emoji: e.target.value })}
                    placeholder="🎯"
                    className="w-14 px-2 py-2 border border-stone-200 rounded-lg text-center text-xl"
                    maxLength={2}
                  />
                  <input
                    type="text"
                    value={nuevaCat.nombre}
                    onChange={e => setNuevaCat({ ...nuevaCat, nombre: e.target.value })}
                    placeholder="Nombre de categoría"
                    className="flex-1 px-3 py-2 border border-stone-200 rounded-lg text-sm"
                  />
                </div>
                <div className="flex gap-1.5 mb-2 flex-wrap">
                  {['#E76F51', '#F4A261', '#E9C46A', '#2A9D8F', '#264653', '#8338EC', '#FF006E', '#3A86FF', '#06D6A0', '#9D4EDD'].map(col => (
                    <button
                      key={col}
                      onClick={() => setNuevaCat({ ...nuevaCat, color: col })}
                      className={`w-7 h-7 rounded-full transition ${nuevaCat.color === col ? 'ring-2 ring-offset-2 ring-stone-900' : ''}`}
                      style={{ backgroundColor: col }}
                    />
                  ))}
                </div>
                <button onClick={agregarCat} disabled={!nuevaCat.nombre.trim()} className="w-full py-2 bg-stone-900 text-white rounded-lg text-sm font-medium disabled:opacity-30">
                  Agregar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Section({ titulo, children }) {
  return (
    <div className="bg-white rounded-2xl border border-stone-200 p-5 shadow-sm">
      <h3 className="font-serif text-base font-semibold mb-3">{titulo}</h3>
      {children}
    </div>
  );
}
