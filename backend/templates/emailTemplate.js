export const ticketStatusUpdateTemplate = (userName, ticketTitle, ticketStatus) => {
  // Status color mapping
  const statusColors = {
    'completed': 'bg-green-100 text-green-800',
    'open': 'bg-blue-100 text-blue-800',
    'in progress': 'bg-yellow-100 text-yellow-800',
    'closed': 'bg-red-100 text-red-800'
  };

  // Status icons (using Heroicons SVG paths)
  const statusIcons = {
    'completed': 'M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
    'open': 'M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z',
    'in progress': 'M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z',
    'closed': 'M16.5 3.75V16.5L12 14.25 7.5 16.5V3.75m9 0H18A2.25 2.25 0 0120.25 6v12A2.25 2.25 0 0118 20.25H6A2.25 2.25 0 013.75 18V6A2.25 2.25 0 016 3.75h1.5m9 0h-9'
  };

  return `
    <div class="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-sm">
      <!-- Header -->
      <div class="text-center mb-8">
        <div class="inline-block bg-blue-600 p-4 rounded-full">
          <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
          </svg>
        </div>
        <h1 class="mt-4 text-2xl font-bold text-gray-800">Ticket Update</h1>
      </div>

      <!-- Content -->
      <div class="border-t border-b border-gray-200 py-6">
        <p class="text-lg text-gray-700 mb-4">Hello ${userName},</p>
        <p class="text-gray-600 mb-6">Your ticket status has been updated:</p>
        
        <div class="bg-gray-50 p-4 rounded-lg">
          <div class="flex items-center mb-3">
            <span class="${statusColors[ticketStatus]} px-3 py-1 rounded-full text-sm font-medium">
              ${ticketStatus.toUpperCase()}
            </span>
            <svg class="w-6 h-6 ml-2 ${statusColors[ticketStatus].replace('bg-', 'text-').replace('100', '600')}" 
                 fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                    d="${statusIcons[ticketStatus]}"/>
            </svg>
          </div>
          <h2 class="text-xl font-semibold text-gray-800">${ticketTitle}</h2>
        </div>
      </div>

      <!-- Action Button -->
      <div class="mt-8 text-center">
        <a href="#" class="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 
          transition duration-200 text-decoration-none">
          View Ticket Details
        </a>
      </div>

      <!-- Footer -->
      <div class="mt-8 text-center text-sm text-gray-500">
        <p>Need help? Contact our <a href="#" class="text-blue-600 hover:underline">support team</a></p>
        <p class="mt-2">© ${new Date().getFullYear()} Ticket Manager. All rights reserved.</p>
      </div>
    </div>
  `;
};