<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AuthController extends Controller
{
    public function index()
    {
        return view ('login.index');
    }

    public function login(Request $request)
    {
        $credentials = $request->validate([
            'email' => 'required|string|email',
            'password' => ['required', 'string']  
        ]);

        $user = User::where("email", $request->email)->first();
        if($user->role!=="ADMIN"){
            return back()->withErrors([
                'validate'=>"Users does'nt have access"
            ])->onlyinput ("validate");
        }

        if (Auth::attempt($credentials)){ 
            $request->session()->regenerate();
            return redirect()->intended('admin');
        }
        return back()->withErrors([
            'email' => 'The provided credentials do not match our record'
        ])->onlyInput('email');
    }
    public function forgotpasswowrd()
    {

    }
    public function logout(Request $request)
    {
        Auth::logout();
        $request->session()->invalidate();
        $request->session()->regenerate();

        return to_route ('login');
    }
}
