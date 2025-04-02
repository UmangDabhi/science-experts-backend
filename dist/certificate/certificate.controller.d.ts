import { CertificateService } from './certificate.service';
import { CreateCertificateDto } from './dto/create-certificate.dto';
import { UpdateCertificateDto } from './dto/update-certificate.dto';
export declare class CertificateController {
    private readonly certificateService;
    constructor(certificateService: CertificateService);
    create(createCertificateDto: CreateCertificateDto): string;
    findAll(): string;
    findOne(id: string): string;
    update(id: string, updateCertificateDto: UpdateCertificateDto): string;
    remove(id: string): string;
}
