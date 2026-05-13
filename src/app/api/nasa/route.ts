import { NextResponse, NextRequest } from 'next/server';

export function GET () {
    return NextResponse.json({
        status: "Aguadando API"
    })
}