@extends('layouts.app')

@section('content')
<div class="flex flex-wrap items-center justify-between gap-3 mb-6 ">
  <h2 class="text-xl font-semibold text-gray-800 dark:text-white/90">Article Form</h2>
  <nav>
    <ol class="flex items-center gap-1.5">
      <li>
        <a class="inline-flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400" href="{{ route('dashboard') }}">
          Home
          <svg class="stroke-current" width="17" height="16" viewBox="0 0 17 16" fill="none"
            xmlns="http://www.w3.org/2000/svg">
            <path d="M6.0765 12.667L10.2432 8.50033L6.0765 4.33366" stroke="" stroke-width="1.2" stroke-linecap="round"
              stroke-linejoin="round"></path> 
          </svg>
        </a>
      </li>
      <li>
        <a class="inline-flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400" href="{{ route('articles.index') }}">
          Articles
          <svg class="stroke-current" width="17" height="16" viewBox="0 0 17 16" fill="none"
            xmlns="http://www.w3.org/2000/svg">
            <path d="M6.0765 12.667L10.2432 8.50033L6.0765 4.33366" stroke="" stroke-width="1.2" stroke-linecap="round"
              stroke-linejoin="round"></path>
          </svg>
        </a>
      </li>
      <li class="text-sm text-gray-800 dark:text-white/90">{{ isset($article) ? 'Edit' : 'Create' }}</li>
    </ol>
  </nav>
</div>

@if (session('success'))
  <div class="mb-4 p-4 text-green-800 bg-green-100 border border-green-300 rounded-lg">
    {{ session('success') }}
  </div>
@endif

@if (session('error'))
  <div class="mb-4 p-4 text-red-800 bg-red-100 border border-red-300 rounded-lg">
    {{ session('error') }}
  </div>
@endif

<div class="flex gap-8">
  <div class="grid grid-cols-1 w-[800px]">
    <div class="space-y-6">
      <div class="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
        <div class="px-5 py-4 sm:px-6 sm:py-5">
          <h3 class="text-base font-medium text-gray-800 dark:text-white/90">
            {{ isset($article) ? 'Edit Article' : 'Create New Article' }}
          </h3>
        </div>
        <form action="{{ isset($article) ? route('articles.update', $article->id) : route('articles.store') }}" method="POST" 
              enctype="multipart/form-data"
              class="p-5 space-y-6 border-t border-gray-100 dark:border-gray-800 sm:p-6">
          @csrf
          @if(isset($article))
            @method('PUT')
          @endif
  
          <!-- Title -->
          <div>
            <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
              Title <span class="text-red-500">*</span>
            </label>
            <input name="title" type="text" value="{{ isset($article) ? $article->title : old('title') }}" placeholder="Enter article title"
              class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-none focus:ring focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800">
  
            @error('title')
            <p class="text-red-500 mt-2 text-sm">{{$message}}</p>
            @enderror
          </div>
          
          <!-- Slug -->
          <div>
            <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
              Slug
            </label>
            <input name="slug" type="text" value="{{ isset($article) ? $article->slug : old('slug') }}" placeholder="Leave empty to auto-generate from title"
              class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-none focus:ring focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800">
            <p class="text-xs text-gray-500 mt-1">Will be auto-generated from title if left empty</p>
            @error('slug')
            <p class="text-red-500 mt-2 text-sm">{{$message}}</p>
            @enderror
          </div>

          <!-- Category -->
          <div>
            <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
              Category
            </label>
            <input name="category" type="text" value="{{ isset($article) ? $article->category : old('category') }}" placeholder="Enter article category"
              class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-none focus:ring focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800">
            @error('category')
            <p class="text-red-500 mt-2 text-sm">{{$message}}</p>
            @enderror
          </div>

          <!-- Icon -->
          <div>
            <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
              Icon
            </label>
            <input name="icon" type="text" value="{{ isset($article) ? $article->icon : old('icon') }}" placeholder="Enter icon class or name"
              class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-none focus:ring focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800">
            @error('icon')
            <p class="text-red-500 mt-2 text-sm">{{$message}}</p>
            @enderror
          </div>

          <!-- Description -->
          <div>
            <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
              Description
            </label>
            <textarea name="description" placeholder="Enter short description" rows="3"
              class="dark:bg-dark-900 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-none focus:ring focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800">{{ isset($article) ? $article->description : old('description') }}</textarea>
            @error('description')
            <p class="text-red-500 mt-2 text-sm">{{$message}}</p>
            @enderror
          </div>

          <!-- Content -->
          <div>
            <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
              Content <span class="text-red-500">*</span>
            </label>
            <textarea name="content" placeholder="Enter article content" rows="8"
              class="dark:bg-dark-900 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-none focus:ring focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800">{{ isset($article) ? $article->content : old('content') }}</textarea>
            @error('content')
            <p class="text-red-500 mt-2 text-sm">{{$message}}</p>
            @enderror
          </div>
          
          <!-- Keywords -->
          <div>
            <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
              Keywords
            </label>
            <input name="keywords" type="text" value="{{ isset($article) ? $article->keywords : old('keywords') }}" placeholder="Enter keywords (comma separated)"
              class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-none focus:ring focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800">
            @error('keywords')
            <p class="text-red-500 mt-2 text-sm">{{$message}}</p>
            @enderror
          </div>
          
          <!-- Meta Description -->
          <div>
            <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
              Meta Description
            </label>
            <textarea name="meta_description" placeholder="Enter meta description for SEO" rows="3"
              class="dark:bg-dark-900 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-none focus:ring focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800">{{ isset($article) ? $article->meta_description : old('meta_description') }}</textarea>
            @error('meta_description')
            <p class="text-red-500 mt-2 text-sm">{{$message}}</p>
            @enderror
          </div>
          
          <!-- Image -->
          <div>
            <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
              Featured Image
            </label>
            
            @if(isset($article) && $article->image_url)
            <div class="mb-3">
              <img src="{{ asset('storage/' . $article->image_url) }}" alt="{{ $article->title }}" class="h-40 object-cover rounded-lg">
              <p class="text-xs text-gray-500 mt-1">Current image</p>
            </div>
            @endif
            
            <input name="image_url" type="file" accept="image/*"
              class="dark:bg-dark-900 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-none focus:ring focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800">
            
            @if(isset($article))
            <p class="text-xs text-gray-500 mt-1">Leave empty to keep the current image</p>
            @endif
            
            @error('image_url')
            <p class="text-red-500 mt-2 text-sm">{{$message}}</p>
            @enderror
          </div>

          <!-- Publication Status -->
          <div>
            <label class="flex items-center gap-3">
              <input name="is_published" type="checkbox" value="1" 
                {{ (isset($article) && $article->is_published) || old('is_published') ? 'checked' : '' }}
                class="h-4 w-4 rounded border-gray-300 text-brand-600 focus:ring-brand-500 dark:border-gray-600 dark:bg-gray-700">
              <span class="text-sm font-medium text-gray-700 dark:text-gray-400">
                Publish Article
              </span>
            </label>
            @error('is_published')
            <p class="text-red-500 mt-2 text-sm">{{$message}}</p>
            @enderror
          </div>

          <!-- Published Date -->
          <div id="published-date-field" style="{{ (isset($article) && $article->is_published) || old('is_published') ? '' : 'display: none;' }}">
            <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
              Published Date
            </label>
            <input name="published_at" type="datetime-local" 
              value="{{ isset($article) && $article->published_at ? $article->published_at->format('Y-m-d\TH:i') : old('published_at') }}"
              class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-none focus:ring focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800">
            <p class="text-xs text-gray-500 mt-1">Leave empty to use current date/time when published</p>
            @error('published_at')
            <p class="text-red-500 mt-2 text-sm">{{$message}}</p>
            @enderror
          </div>

          <!-- Ingredients -->
          <div>
            <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
              Ingredients
            </label>
            <div id="ingredients-container">
              @if(isset($article) && is_array($article->ingredients))
                @foreach($article->ingredients as $index => $ingredient)
                <div class="ingredient-item flex gap-2 mb-2">
                  <input name="ingredients[]" type="text" value="{{ $ingredient }}" placeholder="Enter ingredient"
                    class="dark:bg-dark-900 flex-1 h-11 rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-none focus:ring focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800">
                  <button type="button" class="remove-ingredient px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600">Remove</button>
                </div>
                @endforeach
              @elseif(old('ingredients'))
                @foreach(old('ingredients') as $ingredient)
                <div class="ingredient-item flex gap-2 mb-2">
                  <input name="ingredients[]" type="text" value="{{ $ingredient }}" placeholder="Enter ingredient"
                    class="dark:bg-dark-900 flex-1 h-11 rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-none focus:ring focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800">
                  <button type="button" class="remove-ingredient px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600">Remove</button>
                </div>
                @endforeach
              @endif
            </div>
            <button type="button" id="add-ingredient" class="mt-2 px-3 py-2  text-[#2563eb]  rounded-lg ">Add Ingredient</button>
            @error('ingredients')
            <p class="text-red-500 mt-2 text-sm">{{$message}}</p>
            @enderror
          </div>

          <!-- Benefits -->
          <div>
            <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
              Benefits
            </label>
            <div id="benefits-container">
              @if(isset($article) && is_array($article->benefits))
                @foreach($article->benefits as $index => $benefit)
                <div class="benefit-item flex gap-2 mb-2">
                  <input name="benefits[]" type="text" value="{{ $benefit }}" placeholder="Enter benefit"
                    class="dark:bg-dark-900 flex-1 h-11 rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-none focus:ring focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800">
                  <button type="button" class="remove-benefit px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600">Remove</button>
                </div>
                @endforeach
              @elseif(old('benefits'))
                @foreach(old('benefits') as $benefit)
                <div class="benefit-item flex gap-2 mb-2">
                  <input name="benefits[]" type="text" value="{{ $benefit }}" placeholder="Enter benefit"
                    class="dark:bg-dark-900 flex-1 h-11 rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-none focus:ring focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800">
                  <button type="button" class="remove-benefit px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600">Remove</button>
                </div>
                @endforeach
              @endif
            </div>
            <button type="button" id="add-benefit" class="mt-2 px-3 py-2  text-[#2563eb]  rounded-lg ">Add Benefit</button>
            @error('benefits')
            <p class="text-red-500 mt-2 text-sm">{{$message}}</p>
            @enderror
          </div>

          <!-- Preparation Steps -->
          <div>
            <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
              Preparation Steps
            </label>
            <div id="steps-container">
              @if(isset($article) && is_array($article->preparation_steps))
                @foreach($article->preparation_steps as $index => $step)
                <div class="step-item flex gap-2 mb-2">
                  <span class="step-number bg-gray-200 dark:bg-gray-700 px-3 py-2 rounded-lg text-sm font-medium">{{ $index + 1 }}</span>
                  <textarea name="preparation_steps[]" placeholder="Enter preparation step" rows="2"
                    class="dark:bg-dark-900 flex-1 rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-none focus:ring focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800">{{ $step }}</textarea>
                  <button type="button" class="remove-step px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600">Remove</button>
                </div>
                @endforeach
              @elseif(old('preparation_steps'))
                @foreach(old('preparation_steps') as $index => $step)
                <div class="step-item flex gap-2 mb-2">
                  <span class="step-number bg-gray-200 dark:bg-gray-700 px-3 py-2 rounded-lg text-sm font-medium">{{ $index + 1 }}</span>
                  <textarea name="preparation_steps[]" placeholder="Enter preparation step" rows="2"
                    class="dark:bg-dark-900 flex-1 rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-none focus:ring focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800">{{ $step }}</textarea>
                  <button type="button" class="remove-step px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600">Remove</button>
                </div>
                @endforeach
              @endif
            </div>
            <button type="button" id="add-step" class="mt-2 px-3 py-2 bg-green-500 text-[#2563eb] rounded-lg hover:bg-green-600">Add Step</button>
            @error('preparation_steps')
            <p class="text-red-500 mt-2 text-sm">{{$message}}</p>
            @enderror
          </div>

          <!-- Submit Buttons -->
          <div class="flex justify-end gap-3 pt-6">
            <a href="{{ route('articles.index') }}"
            class="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700">
            Cancel
            </a>
          <button type="submit"
            style="background-color: #2563eb; color: white; padding: 8px 16px; border-radius: 8px;"
            class="px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-brand-600 hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500">
             {{ isset($article) ? 'Update Article' : 'Create Article' }}
          </button>
         </div>
        </form>
      </div>
    </div>
  </div>
</div>

<script>
document.addEventListener('DOMContentLoaded', function() {
    // Toggle published date field
    const publishCheckbox = document.querySelector('input[name="is_published"]');
    const publishedDateField = document.getElementById('published-date-field');
    
    if (publishCheckbox) {
        publishCheckbox.addEventListener('change', function() {
            if (this.checked) {
                publishedDateField.style.display = 'block';
            } else {
                publishedDateField.style.display = 'none';
            }
        });
    }

    // Add Ingredient
    document.getElementById('add-ingredient').addEventListener('click', function() {
        const container = document.getElementById('ingredients-container');
        const div = document.createElement('div');
        div.className = 'ingredient-item flex gap-2 mb-2';
        div.innerHTML = `
            <input name="ingredients[]" type="text" placeholder="Enter ingredient"
              class="dark:bg-dark-900 flex-1 h-11 rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-none focus:ring focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800">
            <button type="button" class="remove-ingredient px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600">Remove</button>
        `;
        container.appendChild(div);
    });

    // Remove Ingredient
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('remove-ingredient')) {
            e.target.parentElement.remove();
        }
    });

    // Add Benefit
    document.getElementById('add-benefit').addEventListener('click', function() {
        const container = document.getElementById('benefits-container');
        const div = document.createElement('div');
        div.className = 'benefit-item flex gap-2 mb-2';
        div.innerHTML = `
            <input name="benefits[]" type="text" placeholder="Enter benefit"
              class="dark:bg-dark-900 flex-1 h-11 rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-none focus:ring focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800">
            <button type="button" class="remove-benefit px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600">Remove</button>
        `;
        container.appendChild(div);
    });

    // Remove Benefit
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('remove-benefit')) {
            e.target.parentElement.remove();
        }
    });

    // Add Step
    document.getElementById('add-step').addEventListener('click', function() {
        const container = document.getElementById('steps-container');
        const stepCount = container.children.length + 1;
        const div = document.createElement('div');
        div.className = 'step-item flex gap-2 mb-2';
        div.innerHTML = `
            <span class="step-number bg-gray-200 dark:bg-gray-700 px-3 py-2 rounded-lg text-sm font-medium">${stepCount}</span>
            <textarea name="preparation_steps[]" placeholder="Enter preparation step" rows="2"
              class="dark:bg-dark-900 flex-1 rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-none focus:ring focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"></textarea>
            <button type="button" class="remove-step px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600">Remove</button>
        `;
        container.appendChild(div);
    });

    // Remove Step
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('remove-step')) {
            e.target.parentElement.remove();
            // Renumber steps
            const steps = document.querySelectorAll('#steps-container .step-number');
            steps.forEach((step, index) => {
                step.textContent = index + 1;
            });
        }
    });
});
</script>

@endsection