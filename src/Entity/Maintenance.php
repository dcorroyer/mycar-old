<?php

namespace App\Entity;

use ApiPlatform\Core\Annotation\ApiResource;
use ApiPlatform\Core\Annotation\ApiSubresource;
use DateTimeInterface;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Component\Validator\Constraints as Assert;

/**
 * @ORM\Entity(repositoryClass="App\Repository\MaintenanceRepository")
 *
 * @ApiResource(
 *      collectionOperations={"GET", "POST"},
 *      itemOperations={"GET", "PUT", "PATCH", "DELETE"},
 *      subresourceOperations={
 *          "invoices_get_subresource"={"path"="/maintenances/{id}/invoices"},
 *          "api_vehicules_maintenances_get_subresource"={
 *              "normalization_context"={"groups"={"maintenances_subresource"}}
 *          }
 *      },
 *      attributes={
 *          "order": {"date":"ASC"}
 *      },
 *      normalizationContext={
 *          "groups"={"maintenances_read"}
 *      },
 *      denormalizationContext={
 *          "disable_type_enforcement"=true
 *      }
 * )
 */
class Maintenance
{
    /**
     * @ORM\Id()
     * @ORM\GeneratedValue()
     * @ORM\Column(type="integer")
     * @Groups({"maintenances_read", "vehicules_read", "invoices_read", "maintenances_subresource"})
     */
    private $id;

    /**
     * @ORM\Column(type="datetime")
     * @Groups({"maintenances_read", "vehicules_read", "invoices_read", "maintenances_subresource"})
     * @Assert\NotBlank(message="La date de la maintenance est obligatoire")
     */
    private $date;

    /**
     * @ORM\Column(type="string", length=100)
     * @Groups({"maintenances_read", "vehicules_read", "invoices_read", "maintenances_subresource"})
     * @Assert\NotBlank(message="Le type de maintenance est obligatoire")
     * @Assert\Choice(choices={"Entretien", "Réparation", "Restauration"},
     *     message="Le type du véhicule doit être Voiture, Moto ou Scooter")
     */
    private $type;

    /**
     * @ORM\OneToMany(targetEntity="App\Entity\Invoice", mappedBy="maintenance", orphanRemoval=true)
     * @Groups({"maintenances_read"})
     * @ApiSubresource()
     */
    private $invoices;

    /**
     * @ORM\ManyToOne(targetEntity="App\Entity\Vehicule", inversedBy="maintenances")
     * @ORM\JoinColumn(nullable=false)
     * @Groups({"maintenances_read"})
     * @Assert\NotBlank(message="Le véhicule lié à la maintenance est obligatoire")
     */
    private $vehicule;

    /**
     * @ORM\Column(type="float")
     * @Groups({"maintenances_read", "vehicules_read", "invoices_read", "maintenances_subresource"})
     * @Assert\NotBlank(message="Le montant de la maintenance est obligatoire")
     * @Assert\Type(type="numeric", message="Le montant de la maintenance doit être numérique")
     */
    private $amount;

    /**
     * @ORM\Column(type="integer")
     * @Groups({"maintenances_read", "vehicules_read", "maintenances_subresource"})
     * @Assert\NotBlank(message="Le chrono de la maintenance est obligatoire")
     * @Assert\Type(type="integer", message="Le chrono doit être un nombre")
     */
    private $chrono;

    public function __construct()
    {
        $this->invoices = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getDate(): ?DateTimeInterface
    {
        return $this->date;
    }

    public function setDate(DateTimeInterface $date): self
    {
        $this->date = $date;

        return $this;
    }

    public function getType(): ?string
    {
        return $this->type;
    }

    public function setType(string $type): self
    {
        $this->type = $type;

        return $this;
    }

    /**
     * @return Collection|Invoice[]
     */
    public function getInvoices(): Collection
    {
        return $this->invoices;
    }

    public function addInvoice(Invoice $invoice): self
    {
        if (!$this->invoices->contains($invoice)) {
            $this->invoices[] = $invoice;
            $invoice->setMaintenance($this);
        }

        return $this;
    }

    public function removeInvoice(Invoice $invoice): self
    {
        if ($this->invoices->contains($invoice)) {
            $this->invoices->removeElement($invoice);
            // set the owning side to null (unless already changed)
            if ($invoice->getMaintenance() === $this) {
                $invoice->setMaintenance(null);
            }
        }

        return $this;
    }

    public function getVehicule(): ?Vehicule
    {
        return $this->vehicule;
    }

    public function setVehicule(?Vehicule $vehicule): self
    {
        $this->vehicule = $vehicule;

        return $this;
    }

    public function getAmount(): ?float
    {
        return $this->amount;
    }

    public function setAmount($amount): self
    {
        $this->amount = $amount;

        return $this;
    }

    public function getChrono(): ?int
    {
        return $this->chrono;
    }

    public function setChrono($chrono): self
    {
        $this->chrono = $chrono;

        return $this;
    }
}
