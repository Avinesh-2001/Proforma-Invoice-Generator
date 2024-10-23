let state = {
            companyname: "",
            companyaddress: "",
            customermobile: "",
            customeremailid: "",
            customername: "",
            pino: "",
            date: "",
            paymentmode: "",
            disptachthrough: "",
            deliverytime: "",
            destination: "",
            vehicleno: "",
            productCode: "",
            productName: "",
            quantity: 1,
            price: 0,
            HSNcode: 9402,
            per: "select",
            products: []
        };

        // Function to handle input changes
        function handleInputChange(event) {
            const { name, value } = event.target;
            state[name] = value;
            updateDisplay();
        }

        // Function to add a product
        function addProduct() {
            const { productCode, productName, quantity, price, HSNcode, per } = state;
            const newProduct = { productCode, productName, quantity, price, HSNcode, per };
            state.products.push(newProduct);
            clearProductForm();
            updateDisplay();
        }

        // Function to delete the last product
        function deleteLastProduct() {
            if (state.products.length > 0) {
                state.products.pop();
                updateDisplay();
            }
        }

        // Function to clear the product form in state and reset input fields
        function clearProductForm() {
            state.productCode = "";
            state.productName = "";
            state.quantity = 1;
            state.price = 0;
            state.HSNcode = 9402;
            state.per = "select";

            // Reset input fields
            document.querySelector('input[name="productCode"]').value = "";
            document.querySelector('input[name="productName"]').value = "";
            document.querySelector('input[name="quantity"]').value = "1";
            document.querySelector('input[name="price"]').value = "0";
            document.querySelector('input[name="HSNcode"]').value = "9402";
            document.querySelector('select[name="per"]').value = "select";
        }

        // Function to calculate total amount
        function calculateTotalAmount() {
            return state.products.reduce((total, product) => total + product.price * product.quantity, 0);
        }

        // Function to calculate GST
        function calculateGST() {
            const totalAmount = calculateTotalAmount();
            return (totalAmount * 0.09).toFixed(2);
        }

        // Function to calculate total value
        function calculateTotalValue() {
            const totalAmount = calculateTotalAmount();
            const totalCGST = parseFloat((totalAmount * 0.09).toFixed(2));
            const totalIGST = parseFloat((totalAmount * 0.09).toFixed(2));
            return (totalAmount + totalCGST + totalIGST).toFixed(2);
        }

        // Function to update the display
        function updateDisplay() {
            // Update company details
            document.getElementById('companyNameDisplay').textContent = state.companyname;
            document.getElementById('companyAddressDisplay').textContent = state.companyaddress;
            document.getElementById('customerMobileDisplay').textContent = state.customermobile;
            document.getElementById('customerEmailDisplay').textContent = state.customeremailid;
            document.getElementById('customerNameDisplay').textContent = state.customername;

            // Update shipping details
            document.getElementById('pinoDisplay').textContent = state.pino;
            document.getElementById('dateDisplay').textContent = state.date;
            document.getElementById('paymentModeDisplay').textContent = state.paymentmode;
            document.getElementById('dispatchThroughDisplay').textContent = state.disptachthrough;
            document.getElementById('deliveryTimeDisplay').textContent = state.deliverytime;
            document.getElementById('destinationDisplay').textContent = state.destination;
            document.getElementById('vehicleNoDisplay').textContent = state.vehicleno;

            // Update product table
            const tableBody = document.getElementById('productTableBody');
            tableBody.innerHTML = '';
            state.products.forEach((product, index) => {
                const row = tableBody.insertRow();
                row.innerHTML = `
                <td class="th1">${index + 1}</td>
                <td class="th2">${product.productCode}</td>
                <td class="th3">${product.productName}</td>
                <td class="th4">${product.HSNcode}</td>
                <td class="th5">${product.quantity}</td>
                <td class="th6">${product.per}</td>
                <td class="th7">${product.price}</td>
                <td class="th8">${product.price * product.quantity}</td>
            `;
            });

            // Add empty rows
            for (let i = 0; i < 8; i++) {
                const emptyRow = tableBody.insertRow();
                emptyRow.innerHTML = `
                <td class="th1" style="padding: 13px;"></td>
                <td class="th2" style="padding: 13px;"></td>
                <td class="th3" style="padding: 13px;"></td>
                <td class="th4" style="padding: 13px;"></td>
                <td class="th5" style="padding: 13px;"></td>
                <td class="th6" style="padding: 13px;"></td>
                <td class="th7" style="padding: 13px;"></td>
                <td class="th8" style="padding: 13px;"></td>`;
            }

            // Update totals
            const totalAmount = calculateTotalAmount();
            const gst = calculateGST();
            const totalValue = calculateTotalValue();

            document.getElementById('totalAmountDisplay').textContent = totalAmount;
            document.getElementById('cgstDisplay').textContent = gst;
            document.getElementById('igstDisplay').textContent = gst;
            document.getElementById('totalValueDisplay').textContent = totalValue + '/-';
        }

        // Function to make a row editable
        function makeRowEditable(row, index) {
            const cells = row.cells;
            for (let i = 1; i < cells.length - 1; i++) {
                cells[i].contentEditable = true;
                cells[i].style.backgroundColor = '#f0f0f0';

                // Add focus and blur event listeners
                cells[i].addEventListener('focus', function () {
                    this.dataset.before = this.innerHTML;
                });

                cells[i].addEventListener('blur', function () {
                    if (this.dataset.before !== this.innerHTML) {
                        updateProduct(row, index);
                    }
                });

                // Ensure numeric fields only accept numbers
                if (i === 3 || i === 4 || i === 6) { // HSNcode, quantity, and price
                    cells[i].addEventListener('keypress', function (e) {
                        if (!/[0-9.]/.test(e.key)) {
                            e.preventDefault();
                        }
                    });
                }
            }
        }

        // Function to update a product after editing
        function updateProduct(row, index) {
            const cells = row.cells;
            const updatedProduct = {
                productCode: cells[1].textContent,
                productName: cells[2].textContent,
                HSNcode: cells[3].textContent,
                quantity: parseFloat(cells[4].textContent) || 0,
                per: cells[5].textContent,
                price: parseFloat(cells[6].textContent) || 0
            };

            state.products[index] = updatedProduct;
            updateDisplay();

            // Reset cell styles
            for (let i = 1; i < cells.length - 1; i++) {
                cells[i].style.backgroundColor = '';
            }
        }

        // Function to download PDF
        function downloadPDF() {
            const { jsPDF } = window.jspdf;
            const input = document.getElementById("invoice-container");
            html2canvas(input, { scale: 2 }).then((canvas) => {
                const imgData = canvas.toDataURL("image/png");
                const pdf = new jsPDF({
                    orientation: "portrait",
                    unit: "pt",
                    format: "a4"
                });

                // PDF dimensions
                const pageWidth = pdf.internal.pageSize.getWidth();
                const pageHeight = pdf.internal.pageSize.getHeight();

                // Set margins (in points)
                const margin = 7;
                const topMargin = 30;
                const subsequentTopMargin = 70;
                const bottomMargin = 50;

                const contentWidth = pageWidth - (2 * margin);
                const contentHeight = pageHeight - topMargin - bottomMargin;

                const imgWidth = contentWidth;
                const imgHeight = (canvas.height * imgWidth) / canvas.width;

                let heightLeft = imgHeight;
                let position = 0;
                let pageNumber = 1;

                while (heightLeft > 0) {
                    if (pageNumber > 1) {
                        pdf.addPage();
                    }

                    const heightToDraw = Math.min(contentHeight, heightLeft);

                    const pageCanvas = document.createElement('canvas');
                    const pageCtx = pageCanvas.getContext('2d');
                    pageCanvas.width = canvas.width;
                    pageCanvas.height = (heightToDraw * canvas.width) / imgWidth;

                    pageCtx.drawImage(
                        canvas,
                        0,
                        position * (canvas.width / imgWidth),
                        canvas.width,
                        pageCanvas.height,
                        0,
                        0,
                        canvas.width,
                        pageCanvas.height
                    );

                    pdf.addImage(
                        pageCanvas.toDataURL("image/png"),
                        "PNG",
                        margin,
                        pageNumber === 1 ? topMargin : subsequentTopMargin,
                        imgWidth,
                        heightToDraw,
                        "",
                        "FAST"
                    );

                    pdf.setFontSize(10);
                    pdf.setTextColor(0, 0, 0);
                    pdf.text(`Page ${pageNumber}`, pageWidth / 2, pageHeight - 20, { align: "center" });

                    heightLeft -= heightToDraw;
                    position += heightToDraw;
                    pageNumber++;
                }

                pdf.save(`Proforma_Invoice_${state.pino}.pdf`);
            });
        }

        // Event listeners
        document.addEventListener('DOMContentLoaded', function () {
            // Add event listeners to all input fields
            const inputs = document.querySelectorAll('input, select');
            inputs.forEach(input => {
                input.addEventListener('change', handleInputChange);
            });

            // Add event listeners to buttons
            document.getElementById('addProduct').addEventListener('click', addProduct);
            document.getElementById('deleteProduct').addEventListener('click', deleteLastProduct);
            document.getElementById('downloadPDF').addEventListener('click', downloadPDF);

            // Add event listener for table changes
            document.getElementById('productTableBody').addEventListener('dblclick', function (event) {
                if (event.target.tagName === 'TD') {
                    const row = event.target.parentNode;
                    const index = row.rowIndex - 1;
                    makeRowEditable(row, index);
                }
            });

            // Initial display update
            updateDisplay();
        });