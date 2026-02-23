{{-- <div
  class="overflow-hidden rounded-2xl border border-gray-200 bg-white px-5 pt-5 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 sm:pt-6"
>
  <div class="flex items-center justify-between">
    <h3 class="text-lg font-semibold text-gray-800 dark:text-white/90">
      Monthly Sales
    </h3>

    <div x-data="{openDropDown: false}" class="relative h-fit">
      <button
        @click="openDropDown = !openDropDown"
        :class="openDropDown ? 'text-gray-700 dark:text-white' : 'text-gray-400 hover:text-gray-700 dark:hover:text-white'"
      >
        <svg
          class="fill-current"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M10.2441 6C10.2441 5.0335 11.0276 4.25 11.9941 4.25H12.0041C12.9706 4.25 13.7541 5.0335 13.7541 6C13.7541 6.9665 12.9706 7.75 12.0041 7.75H11.9941C11.0276 7.75 10.2441 6.9665 10.2441 6ZM10.2441 18C10.2441 17.0335 11.0276 16.25 11.9941 16.25H12.0041C12.9706 16.25 13.7541 17.0335 13.7541 18C13.7541 18.9665 12.9706 19.75 12.0041 19.75H11.9941C11.0276 19.75 10.2441 18.9665 10.2441 18ZM11.9941 10.25C11.0276 10.25 10.2441 11.0335 10.2441 12C10.2441 12.9665 11.0276 13.75 11.9941 13.75H12.0041C12.9706 13.75 13.7541 12.9665 13.7541 12C13.7541 11.0335 12.9706 10.25 12.0041 10.25H11.9941Z"
          />
        </svg>
      </button>
      <div
        x-show="openDropDown"
        @click.outside="openDropDown = false"
        class="absolute right-0 z-40 w-40 p-2 space-y-1 bg-white border border-gray-200 top-full rounded-2xl shadow-theme-lg dark:border-gray-800 dark:bg-gray-dark"
      >
        <button
          class="flex w-full px-3 py-2 font-medium text-left text-gray-500 rounded-lg text-theme-xs hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
        >
          View More
        </button>
        <button
          class="flex w-full px-3 py-2 font-medium text-left text-gray-500 rounded-lg text-theme-xs hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
        >
          Delete
        </button>
      </div>
    </div>
  </div>

  <div class="max-w-full overflow-x-auto custom-scrollbar">
    <div class="-ml-5 min-w-[650px] pl-2 xl:min-w-full">
      <canvas id="monthlySalesChart" class="h-[300px] xl:h-[350px]"></canvas>
    </div>
  </div>
</div>

<!-- Chart.js Script -->
<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
<script>
  // Data yang dipassing dari controller
  var monthlySalesData = @json($monthly_orders); // Pastikan data datang dari controller
  
  var ctx = document.getElementById('monthlySalesChart').getContext('2d');

  var monthlySalesChart = new Chart(ctx, {
    type: 'line', // Jenis grafik
    data: {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'], // Label untuk bulan
      datasets: [{
        label: 'Monthly Sales', // Judul grafik
        data: Object.values(monthlySalesData), // Data pesanan bulanan
        borderColor: '#FEA35E', // Warna garis sesuai dengan yang Anda minta
        backgroundColor: 'rgba(254, 163, 94, 0.2)', // Warna latar belakang area grafik, transparan dengan warna oranye kekuningan
        borderWidth: 2, // Ketebalan garis
        fill: true, // Mengisi area di bawah garis
        pointRadius: 5, // Ukuran titik
        pointBackgroundColor: '#FEA35E', // Warna titik
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false, // Membuat grafik lebih fleksibel
      scales: {
        x: {
          title: {
            display: true,
            text: 'Month', // Nama sumbu X
          }
        },
        y: {
          title: {
            display: true,
            text: 'Sales Count', // Nama sumbu Y
          },
          beginAtZero: true, // Mulai dari 0
          ticks: {
            stepSize: 1, // Mengatur interval untuk angka pada sumbu Y
          }
        }
      },
      plugins: {
        legend: {
          display: false, // Menyembunyikan legenda
        },
        tooltip: {
          mode: 'index',
          intersect: false,
        }
      },
      layout: {
        padding: {
          left: 20, // Menambahkan padding kiri untuk memberikan ruang
          right: 20, // Menambahkan padding kanan untuk memberikan ruang
          top: 20, // Menambahkan padding atas untuk memberikan ruang
          bottom: 20, // Menambahkan padding bawah untuk memberikan ruang
        }
      }
    }
  });
</script> --}}
