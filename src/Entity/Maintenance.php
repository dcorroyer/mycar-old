<?php

namespace App\Entity;

use ApiPlatform\Core\Annotation\ApiFilter;
use ApiPlatform\Core\Annotation\ApiResource;
use ApiPlatform\Core\Annotation\ApiSubresource;
use ApiPlatform\Core\Bridge\Doctrine\Orm\Filter\OrderFilter;
use ApiPlatform\Core\Bridge\Doctrine\Orm\Filter\SearchFilter;
use App\Repository\MaintenanceRepository;
use DateTime;
use DateTimeInterface;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Component\Validator\Constraints as Assert;

#[ORM\Entity(repositoryClass: MaintenanceRepository::class)]
#[ApiResource(
    collectionOperations: [
        'GET',
        'POST'
    ],
    itemOperations: [
        'DELETE',
        'GET' => [
            'normalization_context' => ['groups' => ['read:maintenance:item']]
        ],
        'PUT'
    ],
    subresourceOperations: [
        'invoices_get_subresource' => [
            'method' => 'GET',
            'path'   => '/maintenances/{id}/invoices'
        ]
    ],
    denormalizationContext: ['groups' => ['write:maintenance:item']],
    normalizationContext: ['groups' => ['read:maintenance:collection']],
    order: ['date' => 'ASC'],
    paginationItemsPerPage: 10
)]
#[ApiFilter(
    SearchFilter::class, properties: [
        'date'     => 'partial',
        'type'     => 'partial',
        'vehicule' => 'exact',
    ]
)]
#[ApiFilter(
    OrderFilter::class, properties: [
        'date',
        'amount'
    ]
)]
class Maintenance
{
    public const TYPE = [
        'MAINTENANCE' => 'maintenance',
        'REPAIR'      => 'repair',
        'RESTORATION' => 'restoration'
    ];

    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column(type: 'integer')]
    #[Groups(['read:maintenance:item', 'read:maintenance:collection', 'read:vehicule:item'])]
    private ?int $id;

    #[ORM\Column(type: 'string', length: 100)]
    #[Groups(['read:maintenance:item', 'read:maintenance:collection', 'write:maintenance:item'])]
    #[
        Assert\NotBlank(),
        Assert\Choice(
            choices: [
                Maintenance::TYPE['MAINTENANCE'],
                Maintenance::TYPE['REPAIR'],
                Maintenance::TYPE['RESTORATION']
            ]
        )
    ]
    private ?string $type;

    #[ORM\Column(type: 'date')]
    #[Groups(['read:maintenance:item', 'read:maintenance:collection', 'write:maintenance:item'])]
    #[
        Assert\NotBlank(),
        Assert\Type('DateTime')
    ]
    private ?DateTimeInterface $date;

    #[ORM\Column(type: 'float')]
    #[Groups(['read:maintenance:item', 'read:maintenance:collection', 'write:maintenance:item'])]
    #[
        Assert\NotBlank(),
        Assert\Type('float')
    ]
    private ?float $amount;

    #[ORM\Column(type: 'text')]
    #[Groups(['read:maintenance:item', 'write:maintenance:item'])]
    #[Assert\NotBlank()]
    private ?string $description;

    #[ORM\Column(type: 'datetime')]
    #[Groups(['read:maintenance:item'])]
    #[
        Assert\NotBlank(),
        Assert\Date()
    ]
    private ?DateTime $createdAt;

    #[ORM\ManyToOne(targetEntity: Vehicule::class, inversedBy: 'maintenances')]
    #[ORM\JoinColumn(nullable: false)]
    #[Groups(['read:maintenance:item', 'read:maintenance:collection', 'write:maintenance:item'])]
    #[Assert\NotBlank()]
    private ?Vehicule $vehicule;

    #[ORM\OneToMany(mappedBy: 'maintenance', targetEntity: Invoice::class, orphanRemoval: true)]
    #[Groups(['read:maintenance:item', 'read:maintenance:collection'])]
    #[ApiSubresource()]
    private Collection $invoices;

    public function __construct()
    {
        $this->invoices  = new ArrayCollection();
        $this->createdAt = new DateTime();
    }

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
    public function getType(): ?string
    {
        return $this->type;
    }

    /**
     * @param string $type
     * @return $this
     */
    public function setType(string $type): self
    {
        $this->type = $type;

        return $this;
    }

    /**
     * @return DateTimeInterface|null
     */
    public function getDate(): ?DateTimeInterface
    {
        return $this->date;
    }

    /**
     * @param DateTimeInterface $date
     * @return $this
     */
    public function setDate(DateTimeInterface $date): self
    {
        $this->date = $date;

        return $this;
    }

    /**
     * @return float|null
     */
    public function getAmount(): ?float
    {
        return $this->amount;
    }

    /**
     * @param float $amount
     * @return $this
     */
    public function setAmount(float $amount): self
    {
        $this->amount = $amount;

        return $this;
    }

    /**
     * @return string|null
     */
    public function getDescription(): ?string
    {
        return $this->description;
    }

    /**
     * @param string|null $description
     * @return $this
     */
    public function setDescription(?string $description): self
    {
        $this->description = $description;

        return $this;
    }

    /**
     * @return DateTime|null
     */
    public function getCreatedAt(): ?DateTime
    {
        return $this->createdAt;
    }

    /**
     * @param DateTime|null $createdAt
     * @return $this
     */
    public function setCreatedAt(?DateTime $createdAt): self
    {
        $this->createdAt = $createdAt;

        return $this;
    }

    /**
     * @return Vehicule|null
     */
    public function getVehicule(): ?Vehicule
    {
        return $this->vehicule;
    }

    /**
     * @param Vehicule|null $vehicule
     * @return $this
     */
    public function setVehicule(?Vehicule $vehicule): self
    {
        $this->vehicule = $vehicule;

        return $this;
    }

    /**
     * @return Collection<int, Invoice>
     */
    public function getInvoices(): Collection
    {
        return $this->invoices;
    }

    /**
     * @param Invoice $invoice
     * @return $this
     */
    public function addInvoice(Invoice $invoice): self
    {
        if (!$this->invoices->contains($invoice)) {
            $this->invoices[] = $invoice;
            $invoice->setMaintenance($this);
        }

        return $this;
    }

    /**
     * @param Invoice $invoice
     * @return $this
     */
    public function removeInvoice(Invoice $invoice): self
    {
        if ($this->invoices->removeElement($invoice)) {
            // set the owning side to null (unless already changed)
            if ($invoice->getMaintenance() === $this) {
                $invoice->setMaintenance(null);
            }
        }

        return $this;
    }
}
