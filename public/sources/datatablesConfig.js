//handle datatable for Users
$(function() {
    'use strict';

    var dt_basic_table = $(".datatables-users-basic");

    // DataTable with buttons
    // --------------------------------------------------------------------

    if (dt_basic_table.length) {
        const dt_basic = dt_basic_table.DataTable({


            columns: [
                { data: 'username' , name: "username" },
                { data: 'role' , name: "role" },
                { data: 'createAt' , name: "createAt"},
                { data: 'lastUpdatedAt' , name: "lastUpdatedAt" },
                { data: '' , name: "actions" },
            ],
            columnDefs: [
                {
                    // For Responsive
                    className: '',
                    targets: 0,
                    responsivePriority: 1,
                    render: function (data, type, full, meta) {
                        var $user_img = full['profileImage'],
                            $name = full['username'],
                            $email = full['email'];
                        if ($user_img.imageUrl) {
                            // For Avatar image
                            var $output =
                            '<img src="' + $user_img.imageUrl + '" alt="Avatar" class="rounded-circle" width="50" height="50">';
                        } else {
                            // For Avatar badge
                            var stateNum = Math.floor(Math.random() * 6);
                            var states = ['success', 'danger', 'warning', 'info', 'primary', 'secondary'];
                            var $state = states[stateNum],
                            $name = full['username'],
                            $initials = $name.match(/\b\w/g) || [];
                            $initials = (($initials.shift() || '') + ($initials.pop() || '')).toUpperCase();
                            $output = '<span class="avatar-initial rounded-circle bg-label-' + $state + '">' + $initials + '</span>';
                        }
                        // Creates full output for row
                        var $row_output =
                            '<div class="d-flex justify-content-start align-items-center categories-tr">' +
                            '<div class="avatar-wrapper">' +
                            '<div class="avatar me-2">' +
                            $output +
                            '</div>' +
                            '</div>' +
                            '<div class="d-flex flex-column">' +
                            '<span class="emp_name text-truncate">' +
                            `<a href="javascript:;" class="text-dark">`+
                            $name +
                            `</a>`+
                            '</span>' +
                            '<small class="emp_post text-truncate text-muted">'
                                +$email+
                            '</small>' +
                            '</div>' +
                            '</div>';
                        return $row_output;
                    }
                },
                {
                    // For Responsive
                    responsivePriority: 2,
                    targets: 1,
                    render: function (data, type, full, meta) {
                        return `<span class="role-badge"> 
                            ${data.toLowerCase()}
                        </span>`
                    }
                },
                {
                    // For Responsive
                    className: 'd-none d-xl-table-cell',
                    responsivePriority: 3,
                    targets: 2,
                    render: function (data, type, full, meta) {
                        return moment(data).format('MMM Do YY');
                    }
                },
                {
                    // For Responsive
                    className: 'd-none d-xl-table-cell',
                    targets: 3,
                    render: function (data, type, full, meta) {
                        return `
                            ${data == "" || data == undefined ? "no updated" : moment(data).format('MMM Do YY')}
                        `
                    }
                },
                {
                    // Actions
                    targets: -1,
                    title: 'Actions',
                    orderable: false,
                    searchable: false,
                    render: function (data, type, full, meta) {
                    return `

                        <div class="btn-group dropdown">
                            <div class="dropdown">
                                <button class="btn btn-label-danger btn-sm js-delete-user-btn" type="button" data-id="${full['id']}">
                                ${(localStorage.getItem("Translate") == "ar") ? 'حذف' : 'Delete'}
                                </button>
                            </div>
                        </div>
                        
                        `
                    ;
                    }
                }
            ],
    


        order: [[2, 'desc']],
        displayLength: 7,
        dom: '<"flex-column flex-md-row"<"head-label text-center"><"dt-action-buttons text-end pt-3 pt-md-0"B>><"row"<"col-sm-12 col-md-6"l><"col-sm-12 col-md-6 d-flex justify-content-center justify-content-md-end"f>>t<"row"<"col-sm-12 col-md-6"i><"col-sm-12 col-md-6"p>>',
        lengthMenu: [7, 10, 25, 50, 75, 100],
        buttons: [
            {
                extend: 'collection',
                className: 'btn btn-label-primary dropdown-toggle me-5',
                text: '<i class="ti ti-file-export me-sm-1"></i> <span class="d-none d-sm-inline-block">Export</span>',
                buttons: [
                {
                    extend: 'print',
                    text: '<i class="ti ti-printer me-1" ></i>Print',
                    className: 'dropdown-item',
                    exportOptions: { columns: [0 , 1 , 2 , 3] }
                },
                {
                    extend: 'csv',
                    text: '<i class="ti ti-file-text me-1" ></i>Csv',
                    className: 'dropdown-item',
                    exportOptions: { columns: [0 , 1 , 2 , 3] }
                },
                {
                    extend: 'pdf',
                    text: '<i class="ti ti-file-description me-1"></i>Pdf',
                    className: 'dropdown-item',
                    exportOptions: { columns: [0 , 1 , 2 , 3] }
                },
                {
                    extend: 'copy',
                    text: '<i class="ti ti-copy me-1" ></i>Copy',
                    className: 'dropdown-item',
                    exportOptions: { columns: [0 , 1 , 2 , 3] }
                }
                ]
            },
            ]
        });
    }
    });


    //handle datatable for doctors
$(function() {
    'use strict';

    var dt_basic_table = $(".datatables-doctors-basic");

    // DataTable with buttons
    // --------------------------------------------------------------------

    if (dt_basic_table.length) {
        const dt_basic = dt_basic_table.DataTable({


            columns: [
                { data: 'name' , name: "name" },
                { data: 'specialization' , name: "specialization" },
                { data: 'createAt' , name: "createAt"},
                { data: '' , name: "actions" },
            ],
            columnDefs: [
                {
                    // For Responsive
                    className: '',
                    targets: 0,
                    responsivePriority: 1,
                    render: function (data, type, full, meta) {
                        var $user_img = full['profileImage'],
                            $name = full['name']
                        if ($user_img.imageUrl) {
                            // For Avatar image
                            var $output =
                            '<img src="' + $user_img.imageUrl + '" alt="Avatar" class="rounded-circle" width="50" height="50">';
                        } else {
                            // For Avatar badge
                            var stateNum = Math.floor(Math.random() * 6);
                            var states = ['success', 'danger', 'warning', 'info', 'primary', 'secondary'];
                            var $state = states[stateNum],
                            $name = full['name'],
                            $initials = $name.match(/\b\w/g) || [];
                            $initials = (($initials.shift() || '') + ($initials.pop() || '')).toUpperCase();
                            $output = '<span class="avatar-initial rounded-circle bg-label-' + $state + '">' + $initials + '</span>';
                        }
                        // Creates full output for row
                        var $row_output =
                            '<div class="d-flex justify-content-start align-items-center categories-tr">' +
                            '<div class="avatar-wrapper">' +
                            '<div class="avatar me-2">' +
                            $output +
                            '</div>' +
                            '</div>' +
                            '<div class="d-flex flex-column">' +
                            '<span class="emp_name text-truncate me-2">' +
                            `<a href="javascript:;" class="text-dark">`+
                            $name +
                            `</a>`+
                            '</span>' +
                            '</div>' +
                            '</div>';
                        return $row_output;
                    }
                },
                {
                    // For Responsive
                    responsivePriority: 2,
                    targets: 1,
                    render: function (data, type, full, meta) {
                        return `<span class="role-badge"> 
                            ${data.toLowerCase()}
                        </span>`
                    }
                },
                {
                    // For Responsive
                    className: 'd-none d-xl-table-cell',
                    responsivePriority: 3,
                    targets: 2,
                    render: function (data, type, full, meta) {
                        return moment(data).format('MMM Do YY');
                    }
                },
                {
                    // Actions
                    targets: -1,
                    title: 'Actions',
                    orderable: false,
                    searchable: false,
                    render: function (data, type, full, meta) {
                        return `
                        <div class="btn-group dropdown">
                            <div class="dropdown">
                                <button class="btn btn-label-primary btn-sm dropdown-toggle doc-dropdown" dir="ltr" type="button" data-bs-toggle="dropdown">
                                ${localStorage.getItem("Translate") == "en" ? 'Actions' : 'العمليات'}
                                </button>
                                <ul class="dropdown-menu">
                                    <li>
                                        <a class="dropdown-item  js-details-doctor-btn" href="/Adminpanel/Doctors/Details.html?id=${full["id"]}" data-id=${full["id"]}><i class="fa-regular fa-eye me-2"></i>
                                            ${localStorage.getItem("Translate") == "en" ? 'Details' : 'تفاصيل'}
                                        </a>
                                    </li>
                                    <li>
                                        <a class="dropdown-item js-update-doctor-btn" href="/Adminpanel/Doctors/Update.html?id=${full["id"]}" data-id=${full["id"]}><i class="fa-solid fa-pencil  me-2"></i>
                                            ${localStorage.getItem("Translate") == "en" ? 'Edit' : 'تعديل'}
                                        </a>
                                    </li>
                                    <li> 
                                        <a class="dropdown-item js-delete-doctor-btn" href="javascript:void(0);" data-id=${full["id"]}><i class="fa-solid fa-trash-can me-2"></i>
                                            ${localStorage.getItem("Translate") == "en" ? 'Delete' : 'حذف'}
                                        </a>
                                     </li>
                                </ul>
                            </div>
                        </div>
                        
                        `
                    ;
                    }
                }
            ],
    


        order: [[2, 'desc']],
        displayLength: 7,
        dom: '<"flex-column flex-md-row"<"head-label text-center"><"dt-action-buttons text-end pt-3 pt-md-0"B>><"row"<"col-sm-12 col-md-6"l><"col-sm-12 col-md-6 d-flex justify-content-center justify-content-md-end"f>>t<"row"<"col-sm-12 col-md-6"i><"col-sm-12 col-md-6"p>>',
        lengthMenu: [7, 10, 25, 50, 75, 100],
        buttons: [
            {
                extend: 'collection',
                className: 'btn btn-label-primary dropdown-toggle me-5',
                text: '<i class="ti ti-file-export me-sm-1"></i> <span class="d-none d-sm-inline-block">Export</span>',
                buttons: [
                {
                    extend: 'print',
                    text: '<i class="ti ti-printer me-1" ></i>Print',
                    className: 'dropdown-item',
                    exportOptions: { columns: [0 , 1 , 2] }
                },
                {
                    extend: 'csv',
                    text: '<i class="ti ti-file-text me-1" ></i>Csv',
                    className: 'dropdown-item',
                    exportOptions: { columns: [0 , 1 , 2] }
                },
                {
                    extend: 'pdf',
                    text: '<i class="ti ti-file-description me-1"></i>Pdf',
                    className: 'dropdown-item',
                    exportOptions: { columns: [0 , 1 , 2] }
                },
                {
                    extend: 'copy',
                    text: '<i class="ti ti-copy me-1" ></i>Copy',
                    className: 'dropdown-item',
                    exportOptions: { columns: [0 , 1 , 2] }
                }
                ]
            },
            ]
        });
    }
    });

    
//handle datatable for clinics
$(function() {
    'use strict';

    var dt_basic_table = $(".datatables-clinics-basic");

    // DataTable with buttons
    // --------------------------------------------------------------------

    if (dt_basic_table.length) {
        const dt_basic = dt_basic_table.DataTable({


            columns: [
                { data: 'name' , name: "name" },
                { data: 'createAt' , name: "createAt" },
                { data: 'lastUpdatedAt' , name: "lastUpdatedAt" },
                { data: '' , name: "actions" },
            ],
            columnDefs: [
                {
                    // For Responsive
                    className: '',
                    targets: 0,
                    responsivePriority: 1,
                    render: function (data, type, full, meta) {
                        var $user_img = full['clinicImage'],
                            $name = full['name']
                        if ($user_img.imageUrl) {
                            // For Avatar image
                            var $output =
                            '<img src="' + $user_img.imageUrl + '" alt="Avatar" class="rounded" width="100" height="100">';
                        } else {
                            // For Avatar badge
                            var stateNum = Math.floor(Math.random() * 6);
                            var states = ['success', 'danger', 'warning', 'info', 'primary', 'secondary'];
                            var $state = states[stateNum],
                            $name = full['name'],
                            $initials = $name.match(/\b\w/g) || [];
                            $initials = (($initials.shift() || '') + ($initials.pop() || '')).toUpperCase();
                            $output = '<span class="avatar-initial rounded-circle bg-label-' + $state + '">' + $initials + '</span>';
                        }
                        // Creates full output for row
                        var $row_output =
                            `<div class="d-flex justify-content-start align-items-center categories-tr">` +
                            '<div class="avatar-wrapper">' +
                            '<div class="avatar me-2">' +
                            $output +
                            '</div>' +
                            '</div>' +
                            '<div class="d-flex flex-column">' +
                            '<span class="emp_name text-truncate me-2">' +
                            `<a href="javascript:;" class="text-dark show-image-clinic" data-src="${full['clinicImage'].imageUrl}">`+
                            $name +
                            `</a>`+
                            '</span>' +
                            '</div>' +
                            '</div>';
                        return $row_output;
                    }
                },
                {
                    // For Responsive
                    responsivePriority: 2,
                    targets: 1,
                    render: function (data, type, full, meta) {
                        return moment(data).format('MMM Do YY');
                    }
                },
                {
                    // For Responsive
                    responsivePriority: 3,
                    targets: 2,
                    render: function (data, type, full, meta) {
                        return (data) ? moment(data).format('MMM Do YY'): "no updated";
                    }
                },
                {
                    // Actions
                    targets: -1,
                    title: 'Actions',
                    orderable: false,
                    searchable: false,
                    render: function (data, type, full, meta) {
                        return `
                        <div class="btn-group dropdown">
                            <div class="dropdown">
                                <button class="btn btn-label-primary btn-sm dropdown-toggle clinic-dropdown" dir="ltr" type="button" data-bs-toggle="dropdown">
                                ${localStorage.getItem("Translate") == "en" ? 'Actions' : 'العمليات'}
                                </button>
                                <ul class="dropdown-menu">
                                    <li>
                                        <a class="dropdown-item js-update-clinic-btn" href="javascript:;" data-id=${full["id"]}><i class="fa-solid fa-pencil  me-2"></i>
                                            ${localStorage.getItem("Translate") == "en" ? 'Edit' : 'تعديل'}
                                        </a>
                                    </li>
                                    <li> 
                                        <a class="dropdown-item js-delete-clinic-btn" href="javascript:;" data-id=${full["id"]}><i class="fa-solid fa-trash-can me-2"></i>
                                            ${localStorage.getItem("Translate") == "en" ? 'Delete' : 'حذف'}
                                        </a>
                                     </li>
                                </ul>
                            </div>
                        </div>
                        
                        `
                    ;
                    }
                }
            ],
    


        order: [[2, 'desc']],
        displayLength: 7,
        dom: '<"flex-column flex-md-row"<"head-label text-center"><"dt-action-buttons text-end pt-3 pt-md-0"B>><"row"<"col-sm-12 col-md-6"l><"col-sm-12 col-md-6 d-flex justify-content-center justify-content-md-end"f>>t<"row"<"col-sm-12 col-md-6"i><"col-sm-12 col-md-6"p>>',
        lengthMenu: [7, 10, 25, 50, 75, 100],
        buttons: [
            {
                extend: 'collection',
                className: 'btn btn-label-primary dropdown-toggle me-5',
                text: '<i class="ti ti-file-export me-sm-1"></i> <span class="d-none d-sm-inline-block">Export</span>',
                buttons: [
                {
                    extend: 'print',
                    text: '<i class="ti ti-printer me-1" ></i>Print',
                    className: 'dropdown-item',
                    exportOptions: { columns: [0 , 1 , 2] }
                },
                {
                    extend: 'csv',
                    text: '<i class="ti ti-file-text me-1" ></i>Csv',
                    className: 'dropdown-item',
                    exportOptions: { columns: [0 , 1 , 2] }
                },
                {
                    extend: 'pdf',
                    text: '<i class="ti ti-file-description me-1"></i>Pdf',
                    className: 'dropdown-item',
                    exportOptions: { columns: [0 , 1 , 2] }
                },
                {
                    extend: 'copy',
                    text: '<i class="ti ti-copy me-1" ></i>Copy',
                    className: 'dropdown-item',
                    exportOptions: { columns: [0 , 1 , 2] }
                }
                ]
            },
            ]
        });
    }
    });

//handle datatable for messages
$(function() {
    'use strict';

    var dt_basic_table = $(".datatables-messages-basic");

    // DataTable with buttons
    // --------------------------------------------------------------------

    if (dt_basic_table.length) {
        const dt_basic = dt_basic_table.DataTable({


            columns: [
                { data: 'username' , name: "username" },
                { data: 'email' , name: "email" },
                { data: 'createAt' , name: "createAt"},
                { data: '' , name: "actions" },
            ],
            columnDefs: [
                {
                    // For Responsive
                    targets: 0,
                    responsivePriority: 1,
                },
                {
                    // For Responsive
                    className: 'd-none d-xl-table-cell',
                    responsivePriority: 2,
                    targets: 1,
                },
                {
                    // For Responsive
                    className: 'd-none d-xl-table-cell',
                    responsivePriority: 3,
                    targets: 2,
                    render: function (data, type, full, meta) {
                        return moment(data).format('MMM Do YY');
                    }
                },
                {
                    // Actions
                    targets: -1,
                    title: 'Actions',
                    orderable: false,
                    searchable: false,
                    render: function (data, type, full, meta) {
                    return `

                        <a class="watch-message js-watch-message me-2" href="javascript:;" data-id=${full['id']}>
                        
                            <i class="js-watch-message fa-regular ${full['isWatched'] ? "fa-eye" : "fa-eye-slash"}" data-id=${full['id']}></i>
                        
                        </a>

                        <a class="delete-message js-delete-message" href="javascript:;" data-id=${full['id']}>
                        
                            <i class="js-delete-message fa-regular fa-trash-can" data-id=${full['id']}></i>
                    
                        </a>
                        
                        `
                    ;
                    }
                }
            ],
    


        order: [[2, 'desc']],
        displayLength: 7,
        dom: '<"flex-column flex-md-row"<"head-label text-center"><"dt-action-buttons text-end pt-3 pt-md-0"B>><"row"<"col-sm-12 col-md-6"l><"col-sm-12 col-md-6 d-flex justify-content-center justify-content-md-end"f>>t<"row"<"col-sm-12 col-md-6"i><"col-sm-12 col-md-6"p>>',
        lengthMenu: [7, 10, 25, 50, 75, 100],
        buttons: [
            {
                extend: 'collection',
                className: 'btn btn-label-primary dropdown-toggle me-5',
                text: '<i class="ti ti-file-export me-sm-1"></i> <span class="d-none d-sm-inline-block">Export</span>',
                buttons: [
                {
                    extend: 'print',
                    text: '<i class="ti ti-printer me-1" ></i>Print',
                    className: 'dropdown-item',
                    exportOptions: { columns: [0 , 1 , 2 , 3] }
                },
                {
                    extend: 'csv',
                    text: '<i class="ti ti-file-text me-1" ></i>Csv',
                    className: 'dropdown-item',
                    exportOptions: { columns: [0 , 1 , 2 , 3] }
                },
                {
                    extend: 'pdf',
                    text: '<i class="ti ti-file-description me-1"></i>Pdf',
                    className: 'dropdown-item',
                    exportOptions: { columns: [0 , 1 , 2 , 3] }
                },
                {
                    extend: 'copy',
                    text: '<i class="ti ti-copy me-1" ></i>Copy',
                    className: 'dropdown-item',
                    exportOptions: { columns: [0 , 1 , 2 , 3] }
                }
                ]
            },
            ]
        });
    }
    });


