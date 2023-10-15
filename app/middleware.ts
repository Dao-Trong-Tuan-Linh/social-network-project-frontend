import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from './utils/localstorage'

export function middleware(req:NextRequest) {
    const token = getToken()
    if(!token) {
        return NextResponse.rewrite(new URL('/login',req.url))
    }
    if(!req.nextUrl.pathname.startsWith('/') && token) {
        return NextResponse.redirect('/')
    }
    
}