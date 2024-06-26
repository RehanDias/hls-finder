const resultElement = document.getElementById("result");

async function findHlsUrls() {
   const streamUrlInput = document.getElementById("streamUrl");
   const streamUrl = streamUrlInput.value.trim();

   if (!streamUrl) {
      resultElement.innerHTML =
         '<p class="text-red-500">Masukkan URL stream terlebih dahulu.</p>';
      return;
   }

   resultElement.innerHTML = '<p class="text-gray-500">Mencari URL HLS...</p>';

   try {
      const response = await axios.get(streamUrl);

      if (response.status !== 200) {
         throw new Error(
            `Server returned ${response.status} ${response.statusText}`
         );
      }

      const content = response.data;
      const hlsRegex = /https?:\/\/[\w.\/-]*\.m3u8(?:\?[\w=&.-]+)?/gi;
      const matches = content.match(hlsRegex);

      if (matches && matches.length > 0) {
         const uniqueUrls = [...new Set(matches)];
         renderHlsUrls(uniqueUrls);
      } else {
         resultElement.innerHTML =
            '<p class="text-red-500">Tidak ditemukan URL HLS dalam konten.</p>';
      }
   } catch (error) {
      handleFetchError(error);
   }
}

function renderHlsUrls(urls) {
   resultElement.innerHTML = `
        <p class="font-medium text-gray-700">Ditemukan ${
           urls.length
        } URL HLS:</p>
        <ul class="mt-2 list-disc list-inside space-y-1">
            ${urls
               .map(
                  (url) => `
                <li>
                    <a href="${url}" target="_blank" rel="noopener noreferrer" class="text-indigo-600 hover:text-indigo-800 break-all">
                        ${url}
                    </a>
                </li>
            `
               )
               .join("")}
        </ul>
    `;
}

function handleFetchError(error) {
   if (axios.isAxiosError(error)) {
      if (error.response) {
         resultElement.innerHTML = `<p class="text-red-500">Error ${error.response.status}: ${error.response.statusText}</p>`;
      } else if (error.request) {
         resultElement.innerHTML =
            '<p class="text-red-500">Request tidak mendapat respons</p>';
      } else {
         resultElement.innerHTML = `<p class="text-red-500">Error: ${error.message}</p>`;
      }
   } else {
      resultElement.innerHTML = `<p class="text-red-500">Error: ${error.message}</p>`;
   }
}
