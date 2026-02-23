@extends('layouts.app')

@section('content')
<div class="grid grid-cols-2 gap-5">
  <div class="space-y-6">
    <div class="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
      <div class="px-5 py-4 sm:px-6 sm:py-5">
        <h3 class="text-base font-medium text-gray-800 dark:text-white/90">
          Form
        </h3>
      </div>

      <form action="{{ route('products.store') }}" method="POST" enctype="multipart/form-data">
        <div class="p-6.5">
          <div class="mb-5 flex flex-col gap-6 xl:flex-row">
            <div class="w-full xl:w-1/2">
              <label class="mb-3 block text-sm font-medium text-black dark:text-white">
                Name
              </label>
              <input type="text" placeholder="Name" name="name" value="{{ $product->name ?? old('name') }}"
                class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-none focus:ring focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800">
              @error('name')
              <p class="text-red-500">{{ $message }}</p>
              @enderror
            </div>

            <div class="w-full xl:w-1/2">
              <label class="mb-3 block text-sm font-medium text-black dark:text-white">
                Price
              </label>
              <input type="number" placeholder="0" name="price" value="{{ $product->price ?? old('price') }}"
                class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-none focus:ring focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800">
            </div>
          </div>

          <div class="mb-5.5 flex flex-col gap-6 xl:flex-row">
            <div class="w-full xl:w-1/2">
              <label class="mb-3 block text-sm font-medium text-black dark:text-white">
                Company
              </label>
              <input type="text" placeholder="Company" name="company" value="{{ $product->company ?? old('company') }}"
                class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-none focus:ring focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800">
            </div>

            <div class="w-full xl:w-1/2">
              <label class="mb-3 block text-sm font-medium text-black dark:text-white">
                Active
              </label>
              <div x-data="{ isOptionSelected: false }" class="relative z-20 bg-transparent dark:bg-form-input">
                <select name="is_active"
                  class="dark:bg-dark-900 h-11 w-full appearance-none rounded-lg border border-gray-300 bg-transparent bg-none px-4 py-2.5 pr-11 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-none focus:ring focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800">
                  <option value="1" {{ (isset($product) ? $product->is_active : old('active', 1)) == 1 ? 'selected'
                    :
                    '' }}
                    class="text-body">Yes</option>
                  <option value="0" {{ (isset($product) ? $product->is_active : old('active', 1)) == 0 ? 'selected'
                    :
                    '' }}
                    class="text-body">No</option>

                </select>
                <span class="absolute right-4 top-1/2 z-30 -translate-y-1/2">
                  <svg class="fill-current" width="24" height="24" viewBox="0 0 24 24" fill="none"
                    xmlns="http://www.w3.org/2000/svg">
                    <g opacity="0.8">
                      <path fill-rule="evenodd" clip-rule="evenodd"
                        d="M5.29289 8.29289C5.68342 7.90237 6.31658 7.90237 6.70711 8.29289L12 13.5858L17.2929 8.29289C17.6834 7.90237 18.3166 7.90237 18.7071 8.29289C19.0976 8.68342 19.0976 9.31658 18.7071 9.70711L12.7071 15.7071C12.3166 16.0976 11.6834 16.0976 11.2929 15.7071L5.29289 9.70711C4.90237 9.31658 4.90237 8.68342 5.29289 8.29289Z"
                        fill=""></path>
                    </g>
                  </svg>
                </span>
              </div>
            </div>
          </div>

          <div class="mb-5.5">
            <label class="mb-3 block text-sm font-medium text-black dark:text-white">
              Category
            </label>
            <div x-data="{ isOptionSelected: false }" class="relative z-20 bg-transparent dark:bg-form-input">
              <select name="category_id"
                class="dark:bg-dark-900 h-11 w-full appearance-none rounded-lg border border-gray-300 bg-transparent bg-none px-4 py-2.5 pr-11 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-none focus:ring focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800">

                @foreach ($categories as $category)
                <option {{ $product->category_id ?? old('category_id') == $category->id ? 'selected' : '' }}
                  value="{{ $category->id }}"
                  >
                  {{ $category->name }}
                </option>
                @endforeach

              </select>
              <span class="absolute right-4 top-1/2 z-30 -translate-y-1/2">
                <svg class="fill-current" width="24" height="24" viewBox="0 0 24 24" fill="none"
                  xmlns="http://www.w3.org/2000/svg">
                  <g opacity="0.8">
                    <path fill-rule="evenodd" clip-rule="evenodd"
                      d="M5.29289 8.29289C5.68342 7.90237 6.31658 7.90237 6.70711 8.29289L12 13.5858L17.2929 8.29289C17.6834 7.90237 18.3166 7.90237 18.7071 8.29289C19.0976 8.68342 19.0976 9.31658 18.7071 9.70711L12.7071 15.7071C12.3166 16.0976 11.6834 16.0976 11.2929 15.7071L5.29289 9.70711C4.90237 9.31658 4.90237 8.68342 5.29289 8.29289Z"
                      fill=""></path>
                  </g>
                </svg>
              </span>
            </div>
          </div>

          <div class="mb-6">
            <label class="mb-3 block text-sm font-medium text-black dark:text-white">
              Description
            </label>
            <textarea rows="6" placeholder="Description" name="description"
              class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-none focus:ring focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800">{{ $product->description ?? old('description') }}</textarea>
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
        </div>
      </form>
    </div>
  </div>

  <div class="flex flex-col gap-5">
    <div>
      <div class="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
        <div class="border-b border-stroke px-6.5 py-4 flex items-center justify-between dark:border-strokedark">
          <h3 class="font-medium text-black dark:text-white">
            Images
          </h3>
          <button id="addImageBtn"
            class="inline-flex items-center gap-2 px-4 py-3 text-sm font-medium text-white transition rounded-lg bg-brand-500 shadow-theme-xs hover:bg-brand-600">Add
            Image</button>
        </div>

        <div>
          <input type="file" accept="image/*" id="imageUpload" class="hidden">
        </div>

        <div id="imagePreview" class="grid grid-cols-2 gap-5.5 p-6.5">

        </div>
      </div>
    </div>

    <div>
      <div class="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
        <div class="border-b border-stroke px-6.5 py-4 flex items-center dark:border-strokedark">
          <h3 class="font-medium text-black dark:text-white">
            Variant
          </h3>
        </div>

        <div id="colorsContainer" class="space-y-5 p-6.5">

        </div>

        <div class="p-6.5">
          <button id="btn-add-color"
            class="inline-flex items-center gap-2 px-4 py-3 text-sm font-medium text-white transition rounded-lg bg-brand-500 shadow-theme-xs hover:bg-brand-600">
            <svg class="fill-current" width="20" height="20" viewBox="0 0 20 20" fill="none"
              xmlns="http://www.w3.org/2000/svg">
              <path fill-rule="evenodd" clip-rule="evenodd"
                d="M9.77692 3.24224C9.91768 3.17186 10.0834 3.17186 10.2241 3.24224L15.3713 5.81573L10.3359 8.33331C10.1248 8.43888 9.87626 8.43888 9.66512 8.33331L4.6298 5.81573L9.77692 3.24224ZM3.70264 7.0292V13.4124C3.70264 13.6018 3.80964 13.775 3.97903 13.8597L9.25016 16.4952L9.25016 9.7837C9.16327 9.75296 9.07782 9.71671 8.99432 9.67496L3.70264 7.0292ZM10.7502 16.4955V9.78396C10.8373 9.75316 10.923 9.71683 11.0067 9.67496L16.2984 7.0292V13.4124C16.2984 13.6018 16.1914 13.775 16.022 13.8597L10.7502 16.4955ZM9.41463 17.4831L9.10612 18.1002C9.66916 18.3817 10.3319 18.3817 10.8949 18.1002L16.6928 15.2013C17.3704 14.8625 17.7984 14.17 17.7984 13.4124V6.58831C17.7984 5.83076 17.3704 5.13823 16.6928 4.79945L10.8949 1.90059C10.3319 1.61908 9.66916 1.61907 9.10612 1.90059L9.44152 2.57141L9.10612 1.90059L3.30823 4.79945C2.63065 5.13823 2.20264 5.83076 2.20264 6.58831V13.4124C2.20264 14.17 2.63065 14.8625 3.30823 15.2013L9.10612 18.1002L9.41463 17.4831Z"
                fill=""></path>
            </svg>
            Add Variant
          </button>
        </div>
      </div>
       
    </div>
  </div>

</div>


@endsection
@section('scripts')
<script>
  $(document).ready(function() {
    const token = document.head.querySelector('meta[name="csrf-token"]').content;
    const variants = [];
    
    @if (isset($product))
      const images = {!! json_encode($product->images) !!}; // Gambar yang sudah ada
    @else
      const images = [];
    @endif


    @if (isset($product))
      variants.push(...{!! json_encode($product->variants) !!});
    @else
    variants.push({
        variant_name: "",
        stock: 0,
        size: 0,
        weight: 0.00,
        
      });
    @endif

    const deleteImageArray = [];
    const newImages = [];

    const imageEmpty = $(`
      <div class="w-full h-40 flex items-center justify-between col-span-2">
        <p class="text-center w-full">Image not found</p>
      </div>
    `)

    function displayImages() {
      $('#imagePreview').empty();

      if (images.length === 0 && newImages.length === 0) {
        $('#imagePreview').append(imageEmpty);
      }

      images.forEach((imageUrl, index) => {
        const displayImage = $(`
          <div class="relative">
            <img class="rounded-lg object-cover aspect-square" alt="Image Preview" src="/storage/${imageUrl}" />
            <button data-index="${index}" data-type="old" class="delete-image-button bg-red-500 hover:bg-red-500/90 py-2 px-3.5 text-white rounded-full absolute -top-2 -right-2">
              <i class="fa-solid fa-x"></i>
            </button>
          </div>
        `);
        $('#imagePreview').append(displayImage);
      });

      newImages.forEach((file, index) => {
        const reader = new FileReader();
        reader.onload = function(e) {
          const displayImage = $(`
            <div class="relative">
              <img class="rounded-lg object-cover aspect-square" alt="Image Preview" src="${e.target.result}" />
              <button data-index="${index}" data-type="new" class="delete-image-button bg-red-500 hover:bg-red-500/90 py-2 px-3.5 text-white rounded-full absolute -top-2 -right-2">
                <i class="fa-solid fa-x"></i>
              </button>
            </div>
          `);
          $('#imagePreview').append(displayImage);
        };
        reader.readAsDataURL(file);
      });
    }

    function deleteImages(index, type) {
      if (type === "old") {
        deleteImageArray.push(images[index])
        images.splice(index, 1);
      } else {
        newImages.splice(index, 1);
      }
      displayImages();
    }

    $('#addImageBtn').click(function() {
      $('#imageUpload').click();
    });

    $('#imageUpload').change(function(event) {
      const file = event.target.files[0]; 
      if (file) {
        newImages.push(file);
        displayImages();
      }
    });

    $(document).on('click', '.delete-image-button', async function(event) {
      const index = $(this).attr('data-index');
      const type = $(this).attr('data-type');

      const result = await Swal.fire({
        title: "Do you want to delete this image?",
        icon: "question",
        showDenyButton: true,
        confirmButtonText: "Yes",
        denyButtonText: "No"
      });

      if (result.isConfirmed) {
        deleteImages(index, type);
        Swal.fire("Success", "", "success");
      }
    });

    function renderInputColor() {
      $('#colorsContainer').empty();

      variants.forEach((variant, index) => {
        const newInputColor = $(`
          <div class="w-full grid grid-cols-3 gap-5">
            <div>
              <label class="mb-3 block text-sm font-medium text-black dark:text-white">Name</label>
              <input type="text" placeholder="Name" class="input-color dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-none focus:ring focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800" data-type="variant_name" value="${variant.variant_name}" data-index=${index}>
            </div>

            <div>
              <label class="mb-3 block text-sm font-medium text-black dark:text-white">Stock</label>
              <div class="flex gap-2">
              <input type="number" placeholder="0"  class="input-color dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-none focus:ring focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800" data-type="stock" value="${variant.stock}" data-index=${index}>
              
              </div>
            </div>

            <div>
              <label class="mb-3 block text-sm font-medium text-black dark:text-white">Size</label>
              <div class="flex gap-2">
              <input type="number" placeholder="0"  class="input-color dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-none focus:ring focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800" data-type="size" value="${variant.size}" data-index=${index}>
              
              </div>
            </div>

            <div>
              <label class="mb-3 block text-sm font-medium text-black dark:text-white">Weight</label>
              <div class="flex gap-2">
              <input type="number" placeholder="0"  class="input-color dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-none focus:ring focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800" data-type="weight" value="${variant.weight}" data-index=${index}>
              <button data-index="${index}" class="btn-delete-color bg-red-500 text-white px-3 rounded-lg py-1 text-sm hover:bg-red-500/90 transition-colors">
                  <i class="fa-solid fa-trash"></i>
                </button>
              </div>
            </div>
          </div>
        `);

        $('#colorsContainer').append(newInputColor);
      });
    }

    $(document).on('input', '.input-color', function(event) {
      const index = $(this).attr('data-index');
      const type = $(this).attr("data-type")
      const newValue = $(this).val();
      
      variants[index] = {
        ...variants[index],
        [type]: newValue
      };
    })  

    $(document).on('click', ".btn-delete-color", async function(event) {
      const index = $(this).attr('data-index');
      if (variants.length === 1) {
        Swal.fire({
          icon: "warning",
          title: "Warning",
          text: "You can't delete this variant, product at least have 1 variant"
        })

        return
      }
      
      const result = await Swal.fire({
        title: "Do you want to delete this variant?",
        icon: "question",
        showDenyButton: true,
        confirmButtonText: "Yes",
        denyButtonText: "No"
      });

      if (result.isConfirmed) {
        variants.splice(index, 1)
        Swal.fire("Success", "", "success");
        renderInputColor()
      }
    })

    $('#btn-add-color').click(function(event) {
      variants.push({
        stock: 0,
        size:0,
        weight:0.00,
        variant_name: "",
        color: "#000000",
      })

      renderInputColor()
    })

    $('form').submit(function(event) {
      event.preventDefault();
      const formData = new FormData(this);

      const isEdit = {{ isset($product) ? 'true' : 'false' }};
      if (isEdit) {
        formData.append('_method', 'PUT')
      }
      

      if (images.length === 0 && newImages.length === 0) {
        Swal.fire({
          icon: "warning",
          title: "Warning",
          text: "Please insert at least 1 image"
        });
        return;
      }

      console.log(variants)
      
      if (variants.length === 0 || variants.some(({variant_name, stock, size, weight}) => !variant_name || !stock || !size || !weight)) {
        Swal.fire({
          icon: "warning",
          title: "Warning",
          text: "Make sure variant have valid name and stock!"
        })
        return
      }

      
      formData.append("variants", JSON.stringify(variants));
      

      newImages.forEach((file, index) => {
        formData.append("new_images[]", file);
      });
      
      if (deleteImageArray.length > 0) {
        deleteImageArray.forEach((file, inded) => {
          formData.append("deleted_images[]", file);
        })
      }


      $.ajax({
        url: '{{ isset($product) ? route('products.update', $product->id ?? 0) : route('products.store') }}',
        type: "POST",
        data: formData,
        processData: false,
        contentType: false,
        success: function(response) {
          $('.error-message').remove();
          Swal.fire({
            icon: "success",
            title: "Success",
            text: response.message
          }).then((res) => {
            window.location.href = '{{ route('products.index') }}';
          });

        },
        error: function(xhr) {
          const errors = xhr.responseJSON.errors;
          $('.error-message').remove();
          $.each(errors, function(key, value) {
            var inputField = $('[name="'+ key +'"]');
            inputField.after('<p class="error-message text-red-500">' + value[0] + '</p>');
          });
        }
      });
    });

    displayImages();
    renderInputColor()
  });
</script>
@endsection