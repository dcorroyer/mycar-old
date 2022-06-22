<?php

namespace App\Entity;

use ApiPlatform\Core\Annotation\ApiResource;
use App\Repository\InvoiceRepository;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

#[ORM\Entity(repositoryClass: InvoiceRepository::class)]
#[ApiResource(
    collectionOperations: [
        'get',
        'post'
    ],
    itemOperations: [
        'delete',
        'get' => [
            'normalization_context' => ['groups' => ['read:invoice:item']]
        ],
        'put'
    ],
    denormalizationContext: ['groups' => ['write:invoice:item']],
    normalizationContext: ['groups' => ['read:invoice:collection']],
    order: ['chrono' => 'ASC'],
    paginationItemsPerPage: 10
)]
class Invoice
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column(type: 'integer')]
    #[Groups(['read:invoice:item', 'read:invoice:collection', 'read:maintenance:item'])]
    private ?int $id;

    #[ORM\Column(type: 'string', length: 255)]
    #[Groups(['read:invoice:item', 'read:invoice:collection', 'write:invoice:item'])]
    private ?string $file;

    #[ORM\ManyToOne(targetEntity: Maintenance::class, inversedBy: 'invoices')]
    #[ORM\JoinColumn(nullable: false)]
    #[Groups(['read:invoice:item', 'read:invoice:collection', 'write:invoice:item'])]
    private ?Maintenance $maintenance;

    #[ORM\Column(type: 'integer')]
    #[Groups(['read:invoice:item', 'read:invoice:collection'])]
    private ?int $chrono;

    /**
     * @return int|null
     */
    public function getId(): ?int
    {
        return $this->id;
    }

    /**
     * @return string|null
     */
    public function getFile(): ?string
    {
        return $this->file;
    }

    /**
     * @param string $file
     * @return $this
     */
    public function setFile(string $file): self
    {
        $this->file = $file;

        return $this;
    }

    /**
     * @return Maintenance|null
     */
    public function getMaintenance(): ?Maintenance
    {
        return $this->maintenance;
    }

    /**
     * @param Maintenance|null $maintenance
     * @return $this
     */
    public function setMaintenance(?Maintenance $maintenance): self
    {
        $this->maintenance = $maintenance;

        return $this;
    }

    /**
     * @return int|null
     */
    public function getChrono(): ?int
    {
        return $this->chrono;
    }

    /**
     * @param int $chrono
     * @return $this
     */
    public function setChrono(int $chrono): self
    {
        $this->chrono = $chrono;

        return $this;
    }
}
