@extends('layouts.app')

@section('content')
<div class="flex flex-wrap items-center justify-between gap-3 mb-6">
  <h2 class="text-xl font-semibold text-gray-800 dark:text-white/90">Category Form</h2>
  <nav>
    <ol class="flex items-center gap-1.5">
      <li>
        <a class="inline-flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400" href="index.html">
          Home
          <svg class="stroke-current" width="17" height="16" viewBox="0 0 17 16" fill="none"
            xmlns="http://www.w3.org/2000/svg">
            <path d="M6.0765 12.667L10.2432 8.50033L6.0765 4.33366" stroke="" stroke-width="1.2" stroke-linecap="round"
              stroke-linejoin="round"></path>
          </svg>
        </a>
      </li>
      <li>
        <a class="inline-flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400" href="index.html">
          Category
          <svg class="stroke-current" width="17" height="16" viewBox="0 0 17 16" fill="none"
            xmlns="http://www.w3.org/2000/svg">
            <path d="M6.0765 12.667L10.2432 8.50033L6.0765 4.33366" stroke="" stroke-width="1.2" stroke-linecap="round"
              stroke-linejoin="round"></path>
          </svg>
        </a>
      </li>
      <li class="text-sm text-gray-800 dark:text-white/90">Create</li>
    </ol>
  </nav>
</div>

<div class="flex gap-8">
  <div class="grid grid-cols-1 w-[600px]">
    <div class="space-y-6">
      <div class="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
        <div class="px-5 py-4 sm:px-6 sm:py-5">
          <h3 class="text-base font-medium text-gray-800 dark:text-white/90">
            Form
          </h3>
        </div>
        <form action="{{ route('categories.store') }}" method="POST"
          class="p-5 space-y-6 border-t border-gray-100 dark:border-gray-800 sm:p-6">
          @csrf
  
          <!-- Elements -->
          <div>
            <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
              Name
            </label>
            <input name="name" type="text" placeholder="Enter category name"
              class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-none focus:ring focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800">
  
            @error('name')
            <p class="text-red-500 mt-2">{{$message}}</p>
            @enderror
          </div>
  
          <!-- Elements -->
          <div>
            <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
              Active
            </label>
            <div x-data="{ isOptionSelected: false }" class="relative z-20 bg-transparent">
              <select name="is_active"
                class="dark:bg-dark-900 h-11 w-full appearance-none rounded-lg border border-gray-300 bg-transparent bg-none px-4 py-2.5 pr-11 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-none focus:ring focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
                :class="isOptionSelected &amp;&amp; 'text-gray-800 dark:text-white/90'" @change="isOptionSelected = true">
                <option value="1" class="text-gray-700 dark:bg-gray-900 dark:text-gray-400">
                  Active
                </option>
                <option value="0" class="text-gray-700 dark:bg-gray-900 dark:text-gray-400">
                  Not Active
                </option>
              </select>
              <span
                class="absolute z-30 text-gray-500 -translate-y-1/2 pointer-events-none right-4 top-1/2 dark:text-gray-400">
                <svg class="stroke-current" width="20" height="20" viewBox="0 0 20 20" fill="none"
                  xmlns="http://www.w3.org/2000/svg">
                  <path d="M4.79175 7.396L10.0001 12.6043L15.2084 7.396" stroke="" stroke-width="1.5"
                    stroke-linecap="round" stroke-linejoin="round"></path>
                </svg>
              </span>
            </div>
            @error('is_active')
            <p class="text-red-500 mt-2">{{$message}}</p>
            @enderror
          </div>
  
          <!-- Elements -->
          <div>
            <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
              Description
            </label>
            <textarea name="description" placeholder="Enter a description..." type="text" rows="6"
              class="dark:bg-dark-900 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-none focus:ring focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"></textarea>
            @error('description')
            <p class="text-red-500 mt-2">{{$message}}</p>
            @enderror
          </div>
  
          <button
            class="inline-flex items-center gap-2 px-4 py-3 text-sm font-medium text-white transition rounded-lg bg-brand-500 shadow-theme-xs hover:bg-brand-600">
            <svg class="fill-current" width="20" height="20" viewBox="0 0 20 20" fill="none"
              xmlns="http://www.w3.org/2000/svg">
              <path fill-rule="evenodd" clip-rule="evenodd"
                d="M9.77692 3.24224C9.91768 3.17186 10.0834 3.17186 10.2241 3.24224L15.3713 5.81573L10.3359 8.33331C10.1248 8.43888 9.87626 8.43888 9.66512 8.33331L4.6298 5.81573L9.77692 3.24224ZM3.70264 7.0292V13.4124C3.70264 13.6018 3.80964 13.775 3.97903 13.8597L9.25016 16.4952L9.25016 9.7837C9.16327 9.75296 9.07782 9.71671 8.99432 9.67496L3.70264 7.0292ZM10.7502 16.4955V9.78396C10.8373 9.75316 10.923 9.71683 11.0067 9.67496L16.2984 7.0292V13.4124C16.2984 13.6018 16.1914 13.775 16.022 13.8597L10.7502 16.4955ZM9.41463 17.4831L9.10612 18.1002C9.66916 18.3817 10.3319 18.3817 10.8949 18.1002L16.6928 15.2013C17.3704 14.8625 17.7984 14.17 17.7984 13.4124V6.58831C17.7984 5.83076 17.3704 5.13823 16.6928 4.79945L10.8949 1.90059C10.3319 1.61908 9.66916 1.61907 9.10612 1.90059L9.44152 2.57141L9.10612 1.90059L3.30823 4.79945C2.63065 5.13823 2.20264 5.83076 2.20264 6.58831V13.4124C2.20264 14.17 2.63065 14.8625 3.30823 15.2013L9.10612 18.1002L9.41463 17.4831Z"
                fill=""></path>
            </svg>
            Submit
          </button>
        </form>
      </div>
    </div>
  </div>



</div>



@endsection
