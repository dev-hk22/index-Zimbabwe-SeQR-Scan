interface IInstituteDetails {
    device_type: string;
    id: number;
    institute_username: string;
}

interface IUserDetails extends IInstituteDetails {
    id: number;
    fullname: string;
    l_name: string;
    username: string;
    email_id: string;
    mobile_no: string;
    status: string;
    verify_by: number;
    is_verified: number;
    publish: string;
    is_admin: number | null;
    token: string;
    OTP: number;
    device_type: string;
    print_limit: number | null;
    role_id: number;
    user_type: number;
    registration_no: string;
    working_sector: string | null;
    address: string | null;
    institute: string;
    degree: number;
    branch: number;
    logout: number;
    passout_year: number;
    created_at: string;
    updated_at: string;
    site_id: number;
    access_token: string;
};

interface ITextVerification {
    id: string;
    name: string;
    is_status: number;
    decrypted_value: string;
};

interface IVerifierCertificate {
    id: number;
    serial_no: string;
    student_name: string | null;
    certificate_filename: string;
    template_id: number;
    key: string;
    path: string;
    created_by: number;
    updated_by: number;
    status: string;
    publish: string;
    scan_count: number;
    created_at: string;
    updated_at: string;
    site_id: number;
    template_type: number;
    bc_txn_hash: string | null;
    bc_ipfs_hash: string | null;
    pinata_ipfs_hash: string | null;
    bc_file_hash: string | null;
    certificate_type: string | null;
    json_data: any | null;
    is_encryption: number;
    encryption_type: number;
    files_storage: number;
    bc_sc_id: string | null;
    subject_did: string | null;
    vc_credential_id: string | null;
    fileUrl: string;
    scan_result: string;
    verification_type: number;
    text_verification?: TextVerification[];
    payment_status: boolean;
}

interface IServerError {
    data: {
        status: number;
        message: string;
    };
};

interface IScanHistoryData {
    created_at: string | null;
    date_time: string; // ISO date string
    device_type: string; // Assuming other device types are possible
    document_id: number | null;
    document_status: string | null;
    id: number;
    pdf_url: string;
    scan_by: string; // Assuming this is a user ID in string format
    scan_result: number;
    scanned_data: string;
    site_id: number;
};

interface IAuditScanDetails {
    serialNo: string;
    userPrinted: string;
    printingDateTime: string; // You can use `Date` if you plan to parse it
    printerUsed: string;
    printCount: number;
    scan_result: number;
    key: string;
}

interface QRResponseItem {
  success: boolean;
  status: number;
  message: string;
  data: QRData;
}