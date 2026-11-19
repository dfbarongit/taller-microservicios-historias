<?php

namespace App\Controllers;

use App\Models\Historia;
use Exception;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Capsule\Manager as DB;

class InformesController
{
    public function getConteoPorEstadoPorSprint(int $idSprint): Collection
    {
        return Historia::query()
            ->select('estado', DB::raw('COUNT(*) AS total'))
            ->where('sprint_id', $idSprint)
            ->groupBy('estado')
            ->get();
    }

    public function getConteoPorResponsablePorSprint(int $idSprint): Collection
    {
        return Historia::query()
            ->select([
                'responsable',
                DB::raw('COUNT(*) AS total'),
                DB::raw("SUM(CASE WHEN estado = 'nueva' THEN 1 ELSE 0 END) AS nuevas"),
                DB::raw("SUM(CASE WHEN estado = 'activa' THEN 1 ELSE 0 END) AS activas"),
                DB::raw("SUM(CASE WHEN estado = 'finalizada' THEN 1 ELSE 0 END) AS finalizadas"),
                DB::raw("SUM(CASE WHEN estado = 'impedimento' THEN 1 ELSE 0 END) AS impedimentos")
            ])
            ->where('sprint_id', $idSprint)
            ->groupBy('responsable')
            ->orderBy('responsable', 'ASC')
            ->get();
    }

    public function getConteoPorEstado(): Collection
    {
        return Historia::query()
            ->select('estado', DB::raw('COUNT(*) AS total'))
            ->groupBy('estado')
            ->get();
    }

    public function getConteoPorResponsable(): Collection
    {
        return Historia::query()
            ->select([
                'responsable',
                DB::raw('COUNT(*) AS total'),
                DB::raw("SUM(CASE WHEN estado = 'nueva' THEN 1 ELSE 0 END) AS nuevas"),
                DB::raw("SUM(CASE WHEN estado = 'activa' THEN 1 ELSE 0 END) AS activas"),
                DB::raw("SUM(CASE WHEN estado = 'finalizada' THEN 1 ELSE 0 END) AS finalizadas"),
                DB::raw("SUM(CASE WHEN estado = 'impedimento' THEN 1 ELSE 0 END) AS impedimentos")
            ])
            ->groupBy('responsable')
            ->orderBy('responsable', 'ASC')
            ->get();
    }
}