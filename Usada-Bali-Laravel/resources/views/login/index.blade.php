@extends('layouts.auth')

@section("content")
<div class="flex w-full min-h-screen flex-col md:flex-row">
  <!-- Left Side: Background Image -->
  <div class="w-full md:w-1/2 bg-cover bg-bottom md:bg-bottom p-[80px] md:p-0 text-center relative" style="background-image: url({{ asset('images/logo/logousada.png') }})">
    <!-- Black transparent overlay -->
  

    <!-- Content on top of the overlay -->
    <div class="relative z-10 flex items-center justify-center h-full">
      <!-- Show text before md, hide on md and above -->
      <p class="text-white text-3xl font-extrabold sm:text-5xl font-serif md:hidden">
        Usada Bali
      </p>

     
     
    </div>
  </div>

  <!-- Right Side: Login Form -->
  <div class="w-full md:w-1/2 flex items-center justify-center bg-[#38281C] py-12 px-6">
    <div class="max-w-md w-full space-y-8">
      <a href="{{ route('dashboard') }}" class="flex gap-x-2 text-white hover:text-[#fea35d]">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-6 h-6">
          <path d="m12 19-7-7 7-7"></path>
          <path d="M19 12H5"></path>
        </svg>
        Back
      </a>
      <div class="text-center">
        <h2 class="text-3xl font-serif text-[#FEA35E]">Welcome Back</h2>
        <p class="mt-2 text-white">
          Sign in to your Usada Bali account
        </p>
      </div>

      <form class="mt-8 space-y-6" action="{{ route('login') }}" method="POST">
        @csrf
        <div class="space-y-4">
          <div>
            <label for="email" class="block text-sm font-medium text-[#FEA35E]">
              Email address
            </label>
            <div class="mt-1 relative">
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                class="appearance-none block w-full px-4 py-3 pl-12 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#fea35d] focus:border-transparent"
                placeholder="Enter your email"
                value="{{ old('email') }}"
              />
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="absolute left-4 top-3.5 h-5 w-5 text-gray-400">
                <rect width="20" height="16" x="2" y="4" rx="2"></rect>
                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
              </svg>
            </div>
            @error('email')
            <p class="mt-1 text-sm text-red-500">{{ $message }}</p>
            @enderror
          </div>

          <div>
            <label for="password" class="block text-sm font-medium text-[#FEA35E]">
              Password
            </label>
            <div class="mt-1 relative">
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                class="appearance-none block w-full px-4 py-3 pl-12 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#fea35d] focus:border-transparent"
                placeholder="Enter your password"
              />
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="absolute left-4 top-3.5 h-5 w-5 text-gray-400">
                <rect width="18" height="11" x="3" y="11" rx="2" ry="2"></rect>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
              </svg>
            </div>
            @error('password')
            <p class="mt-1 text-sm text-red-500">{{ $message }}</p>
            @enderror
          </div>
        </div>

        <div class="flex items-center justify-between">
          <div class="flex items-center">
            <input
              id="remember"
              name="remember"
              type="checkbox"
              class="h-4 w-4 text-[#fea35d] focus:ring-[#fea35d] border-gray-300 rounded"
              {{ old('remember') ? 'checked' : '' }}
            />
            <label for="remember" class="ml-2 block text-sm text-white">
              Remember me
            </label>
          </div>

          <div class="text-sm">
            <a  class="font-medium text-[#fea35d] hover:underline">
              Forgot your password?
            </a>
          </div>
        </div>

        @error('validate')
        <p class="text-red-500">{{ $message }}</p>
        @enderror

        <button
          type="submit"
          class="group relative w-full flex justify-center py-3 px-4 border border-transparent rounded-lg text-white bg-[#866447] hover:bg-[#604c38] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#fea35d]"
        >
          Sign in
        </button>

        <div class="text-center mt-4">
          <span class="text-white">Don't have an account?</span>
          <a  class="font-medium text-[#fea35d] hover:underline inline-flex items-center">
            Sign up
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4 ml-1">
              <path d="M5 12h14"></path>
              <path d="m12 5 7 7-7 7"></path>
            </svg>
          </a>
        </div>

        <div class="relative">
          <div class="absolute inset-0 flex items-center">
            <div class="w-full border-t border-[#866447]"></div>
          </div>
          <div class="relative flex justify-center text-sm">
            <span class="px-3 bg-[#866447] text-white rounded-xl">
              Or continue with
            </span>
          </div>
        </div>

        
      </form>
    </div>
  </div>
</div>
@endsection