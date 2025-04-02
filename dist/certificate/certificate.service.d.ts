import { CreateCertificateDto } from './dto/create-certificate.dto';
import { UpdateCertificateDto } from './dto/update-certificate.dto';
export declare class CertificateService {
    create(createCertificateDto: CreateCertificateDto): string;
    findAll(): string;
    findOne(id: number): string;
    update(id: number, updateCertificateDto: UpdateCertificateDto): string;
    remove(id: number): string;
}
